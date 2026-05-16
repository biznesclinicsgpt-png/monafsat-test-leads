/**
 * Pipeline Stages Component
 *
 * Visual representation of the GTM Pipeline stages (0-6)
 * Shows progress and status of leads through the pipeline
 */

import React from 'react';
import { Icons } from '@/constants';

export interface StageStats {
  stage: number;
  name: string;
  name_ar: string;
  count: number;
  percentage?: number;
  status: 'completed' | 'in_progress' | 'pending' | 'error';
}

interface PipelineStagesProps {
  stats: StageStats[];
  currentStage?: number;
  onStageClick?: (stage: number) => void;
  compact?: boolean;
}

const STAGE_ICONS: Record<number, any> = {
  0: Icons.Folder,       // Sources
  1: Icons.Filter,       // Normalize
  2: Icons.Zap,          // Enrichment
  3: Icons.Shield,       // ICP Gate
  4: Icons.Star,         // ICP Score
  5: Icons.Email,        // Contactability
  6: Icons.Send,         // Campaign
};

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  completed: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  in_progress: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  pending: { bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
  error: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
};

export const PipelineStages: React.FC<PipelineStagesProps> = ({
  stats,
  currentStage,
  onStageClick,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {stats.map((stage, index) => {
          const Icon = STAGE_ICONS[stage.stage] || Icons.Layers;
          const colors = STAGE_COLORS[stage.status];
          const isActive = currentStage === stage.stage;

          return (
            <React.Fragment key={stage.stage}>
              <button
                onClick={() => onStageClick?.(stage.stage)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                  ${colors.bg} ${colors.text} ${colors.border}
                  ${isActive ? 'ring-2 ring-brand ring-offset-2' : ''}
                  ${onStageClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-bold">{stage.count}</span>
              </button>
              {index < stats.length - 1 && (
                <Icons.ChevronLeft className="w-4 h-4 text-slate-300 rotate-180" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-4">
      {stats.map((stage, index) => {
        const Icon = STAGE_ICONS[stage.stage] || Icons.Layers;
        const colors = STAGE_COLORS[stage.status];
        const isActive = currentStage === stage.stage;

        return (
          <div key={stage.stage} className="relative">
            {/* Connector Line */}
            {index < stats.length - 1 && (
              <div className="absolute top-1/2 left-full w-4 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            )}

            <button
              onClick={() => onStageClick?.(stage.stage)}
              className={`
                relative z-10 w-full p-4 rounded-xl border-2 transition-all text-center
                ${colors.bg} ${colors.border}
                ${isActive ? 'ring-2 ring-brand ring-offset-2 scale-105' : ''}
                ${onStageClick ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
              `}
            >
              <div className={`w-10 h-10 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 mb-1">المرحلة {stage.stage}</p>
              <h4 className={`font-bold ${colors.text} text-sm mb-2`}>{stage.name_ar}</h4>
              <p className="text-2xl font-bold text-slate-900">{stage.count.toLocaleString()}</p>
              {stage.percentage !== undefined && (
                <p className="text-xs text-slate-500 mt-1">{stage.percentage}%</p>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Mini version for cards
export const PipelineMini: React.FC<{ stages: StageStats[] }> = ({ stages }) => {
  return (
    <div className="flex items-center gap-1">
      {stages.map((stage, index) => {
        const colors = STAGE_COLORS[stage.status];
        return (
          <React.Fragment key={stage.stage}>
            <div
              className={`w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center text-xs font-bold`}
              title={`${stage.name_ar}: ${stage.count}`}
            >
              {stage.stage}
            </div>
            {index < stages.length - 1 && (
              <div className="w-2 h-0.5 bg-slate-200" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PipelineStages;
