/**
 * Data Center Ingest API
 *
 * POST /api/data-center/ingest
 *
 * Unified ingest endpoint for all sources:
 * - CSV Upload
 * - External Pull (Apollo, Phantom)
 * - Master DB
 * - Direct API
 *
 * Golden Rule: all sources → same ingest → same Normalized Lead Object
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Normalizer } from '../../services/data-center/normalizer';
import { ICPEngine } from '../../services/data-center/icpEngine';
import {
  IngestRequest,
  IngestResponse,
  NormalizedLeadObject,
} from '../../services/data-center/types';

// ==========================================
// MAIN HANDLER
// ==========================================

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = req.body as IngestRequest;

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Invalid request',
        details: validation.errors,
      });
    }

    // Process ingest
    const result = await processIngest(body);

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Ingest API Error:', error);
    return res.status(500).json({
      error: 'Ingest failed',
      message: error.message,
    });
  }
}

// ==========================================
// REQUEST VALIDATION
// ==========================================

function validateRequest(body: IngestRequest): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!body.source_type) {
    errors.push('source_type is required');
  }

  if (!body.records || !Array.isArray(body.records)) {
    errors.push('records array is required');
  } else if (body.records.length === 0) {
    errors.push('records array cannot be empty');
  } else if (body.records.length > 10000) {
    errors.push('Maximum 10,000 records per request');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ==========================================
// INGEST PROCESSING
// ==========================================

async function processIngest(request: IngestRequest): Promise<IngestResponse> {
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const startTime = Date.now();

  // Initialize normalizer
  const normalizer = new Normalizer({
    useAI: !request.options?.skip_ai_normalization,
    aiApiKey: process.env.GEMINI_API_KEY,
    autoAcceptHighConfidence: true,
    confidenceThreshold: 85,
  });

  // Step 1: Detect field mapping (if not provided)
  let fieldMapping = request.field_mapping || {};
  let mappingConfidence: Record<string, number> = {};
  let unmappedColumns: string[] = [];

  if (!request.field_mapping && request.records.length > 0) {
    const columns = Object.keys(request.records[0]);
    const mappingResult = await normalizer.detectFieldMapping(columns);
    fieldMapping = mappingResult.mapping;
    mappingConfidence = mappingResult.confidence;
    unmappedColumns = mappingResult.unmapped;
  }

  // Step 2: Normalize records
  const normalizeResult = await normalizer.normalizeBatch(
    request.records.map((raw, index) => ({
      id: `${jobId}_row_${index}`,
      raw_data: raw,
    })),
    fieldMapping
  );

  // Step 3: Detect duplicates
  const dedupMap = new Map<string, NormalizedLeadObject[]>();
  const uniqueRecords: NormalizedLeadObject[] = [];
  const duplicateRecords: NormalizedLeadObject[] = [];

  for (const result of normalizeResult.results) {
    if (result.status === 'failed') continue;

    const dedupKey = result.dedup_key;
    if (dedupKey) {
      if (!dedupMap.has(dedupKey)) {
        dedupMap.set(dedupKey, []);
        uniqueRecords.push(result.normalized);
      } else {
        duplicateRecords.push(result.normalized);
      }
      dedupMap.get(dedupKey)!.push(result.normalized);
    } else {
      uniqueRecords.push(result.normalized);
    }
  }

  // Step 4: Build merge candidates for duplicates
  const mergeCandidates: IngestResponse['dedup']['merge_candidates'] = [];
  for (const [dedupKey, records] of dedupMap.entries()) {
    if (records.length > 1) {
      mergeCandidates.push({
        identity_hash: dedupKey,
        records: records.map(r => r.id),
        confidence: 0.9,
      });
    }
  }

  // Step 5: Collect validation stats
  const errorCounts = new Map<string, number>();
  for (const result of normalizeResult.results) {
    for (const error of result.errors) {
      const count = errorCounts.get(error.rule) || 0;
      errorCounts.set(error.rule, count + 1);
    }
  }

  const topErrors = Array.from(errorCounts.entries())
    .map(([rule, count]) => ({ rule, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Step 6: Update source info on records
  const normalizedRecords = normalizeResult.results
    .filter(r => r.status !== 'failed')
    .map(r => ({
      ...r.normalized,
      source_type: request.source_type,
      source_name: request.source_name || null,
      source_file_name: request.file_name || null,
    }));

  // Build response
  const response: IngestResponse = {
    job_id: jobId,
    status: 'completed',
    total_records: request.records.length,
    processed_records: normalizeResult.results.length,

    field_mapping: {
      detected: fieldMapping,
      confidence: mappingConfidence,
      unmapped: unmappedColumns,
    },

    dedup: {
      unique_records: uniqueRecords.length,
      duplicate_records: duplicateRecords.length,
      merge_candidates: mergeCandidates,
    },

    validation: {
      valid_records: normalizeResult.summary.success,
      invalid_records: normalizeResult.summary.failed,
      warnings_count: normalizeResult.results.reduce((sum, r) => sum + r.warnings.length, 0),
      top_errors: topErrors,
    },

    normalized_records: normalizedRecords,
  };

  console.log(`[INGEST] Job ${jobId} completed in ${Date.now() - startTime}ms`);
  console.log(`[INGEST] Records: ${request.records.length} → Valid: ${normalizeResult.summary.success}, Failed: ${normalizeResult.summary.failed}, Duplicates: ${duplicateRecords.length}`);

  return response;
}

// ==========================================
// HELPER: Parse CSV from request
// ==========================================

export function parseCSVRecords(csvContent: string): Record<string, any>[] {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const records: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;

    const record: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j];
    }
    records.push(record);
  }

  return records;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
}
