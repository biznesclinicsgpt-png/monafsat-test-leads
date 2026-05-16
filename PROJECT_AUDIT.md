# Manafeth v3.0 - Complete Project Audit (Full Details)

> **Generated:** 2026-01-26 | **Total Files:** 185 TypeScript/TSX

---

# SECTION 1: INFRASTRUCTURE

## 1.1 Tech Stack

| Layer | Package | Version | Purpose |
|-------|---------|---------|---------|
| **Runtime** | React | 19.2.3 | UI Framework |
| **Build** | Vite | 6.2.0 | Build Tool |
| **Language** | TypeScript | 5.8.2 | Type Safety |
| **Routing** | react-router-dom | 7.12.0 | Client Routing |
| **State** | React Context | Built-in | Global State |
| **Animation** | framer-motion | 12.26.2 | Animations |
| **Charts** | recharts | 3.6.0 | Data Viz |
| **Icons** | lucide-react | 0.562.0 | Icon Set |
| **Utils** | clsx | 2.1.1 | Class Names |
| **Utils** | tailwind-merge | 3.4.0 | Tailwind Merge |
| **UUID** | uuid | 13.0.0 | ID Generation |
| **CSV** | papaparse | 5.5.3 | CSV Parsing |
| **PDF** | html2pdf.js | 0.14.0 | PDF Export |
| **Confetti** | canvas-confetti | 1.9.4 | Celebrations |
| **Counter** | react-countup | 6.5.3 | Number Animation |
| **DB ORM** | @prisma/client | 5.22.0 | Database ORM |
| **DB** | @vercel/postgres | 0.10.0 | PostgreSQL |
| **Serverless** | @vercel/node | 5.5.23 | API Functions |
| **AI** | @google/genai | 1.36.0 | Gemini AI |
| **AI** | openai | 6.16.0 | OpenAI (Fallback) |
| **Env** | dotenv | 17.2.3 | Environment |

## 1.2 Project Structure

```
manafeth-provider-crm-&-lead-engine/
├── api/                    # 26 API endpoints (Vercel Functions)
├── components/             # 39 React components
├── context/                # 1 Context provider
├── layouts/                # 3 Layout components
├── middleware/             # 1 Middleware file
├── pages/                  # 37 Page components
├── prisma/                 # Database schema + migrations
├── public/                 # Static assets
├── scripts/                # 1 Simulation script
├── services/               # 60+ Service modules
├── types/                  # 2 Type definition files
├── App.tsx                 # Main app component
├── main.tsx                # Entry point
├── constants.ts            # Icons & constants
├── index.css               # Global styles
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
└── vercel.json             # Vercel deployment
```

---

# SECTION 2: PAGES (37 Files)

## 2.1 Public Pages (7)

| File | Path | Size | Description |
|------|------|------|-------------|
| `GrowthSystemPage.tsx` | `/` `/growth` | 85KB | Main landing page with growth system presentation |
| `LandingPage.tsx` | `/scanner` `/landing-legacy` | 83KB | Legacy landing with ninja scanner |
| `InvestmentPage.tsx` | `/investment` | 850B | Investment page wrapper |
| `LoginPage.tsx` | `/login` | 5KB | User login form |
| `AdminLoginPage.tsx` | `/admin/login` | 6KB | Admin login with enhanced validation |
| `NinjaDiagnosisPage.tsx` | `/diagnosis` | 200B | Ninja scanner wrapper |
| `TestDeployment.tsx` | `/test-deploy` | 279B | Deployment test page |

## 2.2 App Pages (10)

| File | Route | Size | Description |
|------|-------|------|-------------|
| `Dashboard.tsx` | `/app` | 12KB | Main dashboard with stats & charts |
| `ProfilePage.tsx` | `/app/profile` | 37KB | Provider profile editor |
| `LeadsPage.tsx` | `/app/leads` | 7KB | Leads list with filters |
| `OpportunitiesPage.tsx` | `/app/opportunities` | 1KB | Opportunities placeholder |
| `ProjectsPage.tsx` | `/app/projects` | 4KB | Projects management |
| `MessagesPage.tsx` | `/app/messages` | 22KB | Messaging inbox |
| `FinancialPage.tsx` | `/app/financial` | 4KB | Financial overview |
| `ReviewsPage.tsx` | `/app/reviews` | 4KB | Customer reviews |
| `ProviderIntegrationsPage.tsx` | `/app/integrations` | 8KB | Provider integrations |
| `AdminNinjaPage.tsx` | `/admin/ninja` | 14KB | Admin ninja scanner |

## 2.3 Data Center Pages (13)

| File | Route | Size | Description |
|------|-------|------|-------------|
| `DataCenterPage.tsx` | `/app/data-center` | 11KB | Pipeline overview dashboard |
| `ImportPage.tsx` | `/app/data-center/import` | **60KB** | Source selection & import wizard |
| `EnrichPage.tsx` | `/app/data-center/enrich` | 11KB | AI enrichment agents |
| `ICPPage.tsx` | `/app/data-center/icp` | 16KB | ICP verification & scoring |
| `ContactabilityPage.tsx` | `/app/data-center/contactability` | 18KB | Email/phone verification |
| `CampaignPage.tsx` | `/app/data-center/campaign` | 16KB | Campaign preparation & export |
| `DatabasePage.tsx` | `/app/data-center/database` | 16KB | Lead database table |
| `StagingPage.tsx` | `/app/data-center/staging` | 31KB | Staging area for imports |
| `ProviderPacksPage.tsx` | `/app/data-center/packs` | 36KB | Provider data packs |
| `ProvidersStatusPage.tsx` | `/app/data-center/providers-status` | 13KB | Provider connection status |
| `IntegrationsPage.tsx` | `/app/data-center/integrations` | 6KB | Legacy integrations |
| `ImportsPage.tsx` | `/app/data-center/imports` | 5KB | Import history |
| `index.ts` | - | 1KB | Barrel exports |

## 2.4 Admin Pages (8)

| File | Route | Size | Description |
|------|-------|------|-------------|
| `AuditPage.tsx` | `/admin/audit` | 15KB | Admin audit log viewer |
| `WalletPage.tsx` | `/admin/wallet` | 13KB | Credit wallet management |
| `WorkspacesPage.tsx` | `/admin/workspaces` | 11KB | Workspace management |
| `IntegrationsHub/index.tsx` | `/admin/integrations` | 5KB | Hub layout |
| `IntegrationsHub/ConnectorsTab.tsx` | `/admin/integrations/connectors` | - | Provider connectors |
| `IntegrationsHub/PoliciesTab.tsx` | `/admin/integrations/policies` | - | Usage policies |
| `IntegrationsHub/RoutingTab.tsx` | `/admin/integrations/routing` | - | Waterfall routing |
| `IntegrationsHub/WalletTab.tsx` | `/admin/integrations/wallet` | - | Wallet settings |

---

# SECTION 3: COMPONENTS (39 Files)

## 3.1 Contacts Components (8)

| File | Size | Exports |
|------|------|---------|
| `ContactsManager.tsx` | - | Main contacts view with table & kanban |
| `ContactsTable.tsx` | - | Sortable, filterable contacts table |
| `PipelineKanban.tsx` | - | Drag-drop pipeline stages |
| `LeadModal.tsx` | - | Lead detail modal |
| `AddContactsWizard.tsx` | - | Multi-step contact add wizard |
| `CSVImporter.tsx` | - | CSV file importer |
| `CampaignExportModal.tsx` | - | Export to campaign modal |
| `SegmentsList.tsx` | - | Saved segments list |

## 3.2 Dashboard Components (2)

| File | Size | Exports |
|------|------|---------|
| `Dashboard.tsx` | 12KB | Main dashboard component |
| `Dashboard/ICPStrategyModal.tsx` | - | ICP strategy configuration modal |

## 3.3 Data Center Components (11)

| File | Size | Exports |
|------|------|---------|
| `AllDataView.tsx` | 22KB | Full data grid view |
| `LeadTable.tsx` | 9KB | Lead data table |
| `LeadDetailTables.tsx` | 27KB | Detailed lead info tabs |
| `LemlistSearch.tsx` | **81KB** | Lemlist people search interface |
| `PipelineStages.tsx` | 5KB | Visual pipeline stage component |
| `StagingGrid.tsx` | 16KB | Staging data grid |
| `Integrations/ProviderCard.tsx` | - | Provider connection card |
| `Integrations/UsageStats.tsx` | - | Usage statistics chart |
| `Integrations/WaterfallConfig.tsx` | - | Waterfall configuration |
| `Integrations/index.ts` | - | Barrel exports |
| `index.ts` | - | Barrel exports |

## 3.4 Investment Components (6)

| File | Purpose |
|------|---------|
| `EngineHero.tsx` | Hero section with engine visualization |
| `FuelGauge.tsx` | Credit fuel gauge animation |
| `GuaranteeSection.tsx` | Guarantee & trust section |
| `JourneyTimeline.tsx` | Customer journey timeline |
| `PerformanceCore.tsx` | Performance metrics display |
| `WalletModel.tsx` | Wallet/credit model explanation |

## 3.5 NinjaScanner Components (9)

| File | Size | Purpose |
|------|------|---------|
| `NinjaScanner.tsx` | **61KB** | Main scanner component |
| `components/Charts.tsx` | - | Result charts |
| `components/InputGroup.tsx` | - | Form input groups |
| `components/Interactions.tsx` | - | User interactions |
| `components/NinjaReportView.tsx` | - | Report display |
| `components/PDFReport.tsx` | - | PDF export |
| `constants.ts` | 3KB | Scanner constants |
| `types.ts` | 2KB | Scanner types |
| `utils.ts` | 13KB | Scanner utilities |

## 3.6 Other Components (3)

| File | Purpose |
|------|---------|
| `PlaceholderPage.tsx` | Generic placeholder page |
| `Simulation/SimulationWizard.tsx` | Simulation wizard |
| `Wizard/ProviderWizard.tsx` | Provider profile wizard |

---

# SECTION 4: SERVICES (60+ Files)

## 4.1 Core Services (15)

### `apolloService.ts` (44KB, 1099 lines)
**Functions:**
```typescript
// Interfaces
interface ApolloSearchFilters { ... }
interface ApolloPersonFull { ... }      // 80+ fields
interface ApolloOrganizationFull { ... } // 100+ fields

// Functions
cleanFilters(obj): Record<string, any>
searchApolloPeople(filters, apiKey): Promise<ApolloPersonFull[]>
searchApolloCompanies(filters, apiKey): Promise<ApolloOrganizationFull[]>
isObfuscated(value): boolean
cleanName(value): string | undefined
enrichApolloPerson(params, apiKey): Promise<ApolloPersonFull | null>
resolvePersonMatch(params, apiKey): Promise<ResolverResult>
enrichApolloPeople(details[], apiKey): Promise<ApolloPersonFull[]>
enrichApolloOrganization(domain, apiKey): Promise<ApolloOrganizationFull | null>
enrichApolloOrganizations(domains[], apiKey): Promise<ApolloOrganizationFull[]>
formatPhoneNumbers(phones): string
transformApolloToStagingRow(person): StagingRow
```

### `lemlistService.ts` (28KB, 780 lines)
**Functions:**
```typescript
createAuthHeader(apiKey): string
createAuthHeaderBrowser(apiKey): string
searchLemlistPeople(params, apiKey): Promise<LemlistSearchResponse>
enrichLemlistData(params, apiKey): Promise<LemlistEnrichmentResponse>
getLemlistEnrichmentResult(id, apiKey): Promise<LemlistEnrichmentResult>
checkLemlistCredits(apiKey): Promise<{total, freemium, subscription, gifted, paid}>
getLemlistFilters(apiKey): Promise<LemlistFilterOption[]>
getDefaultFilters(): LemlistFilterOption[]
transformLemlistPersonToRawJson(person): Record<string, any>
transformLemlistPeopleToRows(people): Array<{rawJson, normalizedJson}>
delay(ms): void
selectEnrichmentStrategy(data): EnrichmentStrategy
buildEnrichmentParams(data, strategy, options): LemlistEnrichmentParams
parseEnrichmentResult(result, id): ParsedEnrichmentResult
smartEnrichContact(data, apiKey, options): Promise<ParsedEnrichmentResult>
batchSmartEnrich(contacts[], apiKey, options): Promise<ParsedEnrichmentResult[]>
enrichWithFallback(data, apiKey, options): Promise<ParsedEnrichmentResult>
```

### `prospeoService.ts` (27KB, 730 lines)
**Interfaces:**
```typescript
interface ProspeoEnrichRequest { data, only_verified_email?, enrich_mobile?, only_verified_mobile? }
interface ProspeoPersonData { first_name?, last_name?, full_name?, linkedin_url?, email?, company_name?, company_website?, company_linkedin_url?, person_id? }
interface ProspeoMobile { status, revealed, mobile?, mobile_national?, mobile_international?, mobile_country?, mobile_country_code? }
interface ProspeoEmail { status, revealed, email?, verification_method?, email_mx_provider? }
interface ProspeoLocation { country?, country_code?, state?, city?, time_zone?, time_zone_offset? }
interface ProspeoJobHistory { title?, company_name?, logo_url?, current?, start_year?, ... }
interface ProspeoCompany { company_id?, name?, website?, domain?, industry?, employee_count?, ... (50+ fields) }
interface ProspeoPersonResult { person_id?, first_name?, last_name?, full_name?, linkedin_url?, current_job_title?, ... }
interface ProspeoEnrichResponse { error, error_code?, free_enrichment?, person?, company? }
```
**Functions:**
```typescript
enrichProspecoPerson(apiKey, data, options): Promise<ProspeoEnrichResponse>
batchEnrichProspeoPersons(apiKey, persons[], options): Promise<{results, summary}>
// + data transformation helpers
```

### `walletService.ts` (14KB, 591 lines)
**Interfaces:**
```typescript
interface WalletBalance { workspaceId, creditBalance, reservedCredits, availableCredits, monthlyLimit, dailyLimit, usedThisMonth, usedToday, status }
interface CreditReservation { id, workspaceId, amount, providerId, requestType, entityId?, createdAt, expiresAt }
interface DeductionResult { success, reservationId?, error?, errorCode?, availableCredits? }
interface CostMatrix { email_enrich, phone_enrich, company_enrich, linkedin_enrich, verify_email, verify_phone }
```
**Functions:**
```typescript
getOperationCost(providerSlug, requestType, costOverride?): number
getWalletBalance(workspaceId): WalletBalance | null
initializeWallet(workspaceId, initialCredits): WalletBalance
saveWalletBalance(wallet): void
checkBalance(workspaceId, amount, providerSlug?): {canProceed, error?, errorCode?}
reserveCredits(workspaceId, amount, providerId, requestType, entityId?): DeductionResult
confirmDeduction(reservationId): boolean
releaseReservation(reservationId): boolean
addCredits(workspaceId, amount, note?, performedBy?): boolean
issueRefund(workspaceId, amount, providerId, reason?): boolean
getTransactionHistory(workspaceId, limit): Array<TransactionLog>
cleanupExpiredReservations(): void
```

### `integrationsService.ts` (12KB, 402 lines)
**Functions:**
```typescript
getAvailableProviders(): Provider[]
getStoredProviders(): Provider[]
saveProvider(provider): Provider
disconnectProvider(slug): void
testProviderConnection(slug, apiKey): Promise<{success, message, creditsRemaining?}>
saveProviderCredentials(slug, apiKey): void
getProviderCredentials(slug): string | null
removeProviderCredentials(slug): void
getWaterfalls(): Waterfall[]
getDefaultWaterfalls(): Waterfall[]
saveWaterfall(waterfall): Waterfall
deleteWaterfall(id): void
createWaterfall(data): Waterfall
getUsageStats(period): {...}
getRecentLogs(): {...}
```

### Other Core Services

| File | Size | Purpose |
|------|------|---------|
| `geminiService.ts` | 2KB | Google Gemini AI integration |
| `enrichmentService.ts` | 2KB | Data enrichment orchestration |
| `ingestService.ts` | 1KB | Data ingestion |
| `mappingService.ts` | 2KB | Field mapping |
| `scoringService.ts` | 4KB | Lead scoring |
| `contactDiscoveryService.ts` | 2KB | Contact discovery |
| `csvParser.ts` | 644B | CSV parsing |
| `scriptingService.ts` | 3KB | Scripting utilities |
| `simulationService.ts` | 2KB | Simulation data |
| `providerToICP.ts` | 3KB | Provider to ICP conversion |

## 4.2 Data Center Module (20 files)

### `icpEngine.ts` (21KB, 743 lines)
**Interfaces:**
```typescript
interface ICPVerifyResult { icp_status: 'Yes'|'No'|'Unknown', fit_score, reasons[], confidence, missing_fields[], matched_rules[], failed_rules[] }
interface ScoringWeights { industry, title, seniority, company_size, geo }
interface ScoringResult { total_score, breakdown[], confidence, tier: 'VIP'|'Priority'|'Standard'|'Low' }
```
**Functions:**
```typescript
buildICPRulesFromProvider(provider: ProviderProfile): ICPRule[]
buildBasicICPRules(provider: ProviderProfile): ICPRule[]
verifyICP(lead, rules, threshold): ICPVerifyResult
evaluateRule(value, rule): boolean
verifyICPBatch(leads[], rules, threshold): ICPVerifyResponse
calculateICPScore(lead, rules, weights?): ScoringResult
getSeniorityScore(seniority, maxScore): {score, reason}
isGCCCountry(country): boolean
getICPEngine(rules?, threshold?): ICPEngine
```
**Class:** `ICPEngine`
```typescript
class ICPEngine {
  constructor(rules?, threshold?)
  initFromProvider(provider): void
  initFromICPProfile(profile): void
  setRules(rules): void
  setThreshold(threshold): void
  verify(lead): ICPVerifyResult
  verifyBatch(leads[]): ICPVerifyResponse
  score(lead, weights?): ScoringResult
  getRules(): ICPRule[]
}
```

### `normalizer.ts` (19KB, 600 lines)
**Interfaces:**
```typescript
interface NormalizerOptions { useAI?, aiApiKey?, strictValidation?, autoAcceptHighConfidence?, confidenceThreshold? }
interface NormalizationResult { id, status: 'success'|'partial'|'failed', normalized, errors[], warnings[], ai_suggestions[], dedup_key }
```
**Class:** `Normalizer`
```typescript
class Normalizer {
  constructor(options?)
  detectFieldMapping(columns[]): Promise<{mapping, confidence, unmapped[]}>
  normalizeRecord(raw, mapping?, id?): Promise<NormalizationResult>
  normalizeBatch(records[], mapping?, onProgress?): Promise<{results[], summary}>
}
```

### `validators.ts` (24KB, 749 lines)
**Functions:**
```typescript
validateEmail(email): {valid, normalized, errors[], warnings[]}
validatePhone(phone): {valid, normalized, format, errors[], warnings[]}
validateLinkedInUrl(url, type): {valid, normalized, linkedin_id, errors[], warnings[]}
validateName(name, field): {valid, normalized, errors[], warnings[]}
validateCompanyName(name): {valid, normalized, errors[], warnings[]}
validateDomain(domain): {valid, normalized, errors[], warnings[]}
validateTitle(title): {valid, normalized, seniority, department, errors[], warnings[]}
validateIndustry(industry): {valid, normalized, taxonomy_key, errors[], warnings[]}
validateCompanySize(size): {valid, normalized, raw, errors[], warnings[]}
validateCountry(country): {valid, normalized, code, is_gcc, errors[], warnings[]}
validateRecord(raw, mapping?): ValidateRecordResult
generateDedupKey(lead): string
generateIdentityHash(lead): Promise<string>
```

### `types.ts` (12KB)
**Exports:**
- `NormalizedLeadObject` - 50+ fields
- `ICPRule` - ICP rule definition
- `ValidationError` / `ValidationWarning`
- `AISuggestion`
- `CANONICAL_FIELDS` - Field definitions
- `SENIORITY_PATTERNS` - Seniority detection
- `INDUSTRY_TAXONOMY` - Industry classification
- `COMPANY_SIZE_RANGES` - Size buckets
- `GCC_REGIONS` - GCC countries

### Agents Submodule (10 files)
```
services/data-center/agents/
├── baseAgent.ts           # Base agent class
├── companyAgent.ts        # Company enrichment agent
├── contactabilityOrchestrator.ts  # Email/phone verification
├── emailAgent.ts          # Email discovery agent
├── emailVerifierAgent.ts  # Email verification agent
├── index.ts               # Barrel exports
├── orchestrator.ts        # Agent orchestrator
├── personAgent.ts         # Person enrichment agent
├── phoneAgent.ts          # Phone discovery agent
└── types.ts               # Agent types
```

### Campaign Submodule (5 files)
```
services/data-center/campaign/
├── exporter.ts            # Export to platforms
├── index.ts               # Barrel exports
├── personalization.ts     # Template personalization
├── templateManager.ts     # Email templates
└── types.ts               # Campaign types
```

## 4.3 Providers Module (17 adapters)

### Provider Adapters
```
services/providers/adapters/
├── apolloAdapter.ts       # Apollo.io
├── baseAdapter.ts         # Base adapter class
├── bettercontactAdapter.ts # BetterContact
├── clearbitAdapter.ts     # Clearbit
├── contactoutAdapter.ts   # ContactOut
├── dropcontactAdapter.ts  # Dropcontact
├── findymailAdapter.ts    # Findymail
├── fullenrichAdapter.ts   # FullEnrich
├── hunterAdapter.ts       # Hunter.io
├── icypeasAdapter.ts      # Icypeas
├── index.ts               # Barrel exports
├── kasporAdapter.ts       # Kaspr
├── lemlistAdapter.ts      # Lemlist
├── lushaAdapter.ts        # Lusha
├── prospeoAdapter.ts      # Prospeo
├── rocketreachAdapter.ts  # RocketReach
└── snovAdapter.ts         # Snov.io
```

### Provider Core
| File | Size | Purpose |
|------|------|---------|
| `index.ts` | 268B | Barrel exports |
| `types.ts` | 11KB | Provider interfaces |
| `providerFactory.ts` | 4KB | Dynamic provider instantiation |
| `waterfallOrchestrator.ts` | 15KB | Multi-provider enrichment |

## 4.4 Pipeline Module (4 files)
```
services/pipeline/
├── deduplicationService.ts    # Dedup logic
├── enrichmentOrchestrator.ts  # Enrichment flow
├── scoringService.ts          # Lead scoring
└── validationService.ts       # Data validation
```

## 4.5 Encryption Module (2 files)
```
services/encryption/
├── credentialEncryption.ts  # AES-256-GCM encryption
└── credentialService.ts     # Credential management
```

## 4.6 Auth Module (1 file)
```
services/auth/
└── jwtService.ts  # JWT token handling
```

## 4.7 AI Module (1 file)
```
services/ai/
└── apolloQueryBuilder.ts  # Natural language to Apollo query
```

---

# SECTION 5: API ENDPOINTS (26 Files)

## 5.1 Admin APIs (3)
```
api/admin/integrations/
├── policies.ts    # POST /api/admin/integrations/policies
├── providers.ts   # POST /api/admin/integrations/providers
└── wallet.ts      # POST /api/admin/integrations/wallet
```

## 5.2 AI APIs (2)
```
api/ai/
├── analyze-competitors.ts  # POST /api/ai/analyze-competitors
└── strategy.ts             # POST /api/ai/strategy
```

## 5.3 Contacts APIs (3)
```
api/contacts/
├── index.ts          # GET/POST /api/contacts
├── companies.ts      # GET/POST /api/contacts/companies
└── opportunities.ts  # GET/POST /api/contacts/opportunities
```

## 5.4 Data Center APIs (7)
```
api/data-center/
├── index.ts          # GET /api/data-center (docs)
├── ingest.ts         # POST /api/data-center/ingest
├── normalize.ts      # POST /api/data-center/normalize
├── enrich.ts         # POST /api/data-center/enrich
├── icp.ts            # POST /api/data-center/icp
├── contactability.ts # POST /api/data-center/contactability
└── campaign.ts       # POST /api/data-center/campaign
```

### Data Center API Actions

**`/api/data-center/ingest`**
```typescript
POST {
  source_type: 'csv_upload' | 'external_pull' | 'api' | 'master_db',
  records: Array<Record<string, any>>,
  field_mapping?: Record<string, string>,
  options?: {
    skip_ai_normalization?: boolean,
    skip_dedup?: boolean,
    auto_enrich_missing?: boolean
  }
}
```

**`/api/data-center/normalize`**
```typescript
POST {
  action: 'default' | 'detect-mapping' | 'batch' | 'preview',
  data: Record<string, any> | Array<Record<string, any>>,
  columns?: string[]  // for detect-mapping
}
```

**`/api/data-center/icp`**
```typescript
POST {
  action: 'verify' | 'score' | 'rules' | 'analyze' | 'from-provider',
  lead?: NormalizedLeadObject,
  leads?: NormalizedLeadObject[],
  rules?: ICPRule[],
  providerId?: string
}
```

## 5.5 Enrichment APIs (3)
```
api/enrichment/
├── index.ts        # GET /api/enrichment
├── prospeo.ts      # POST /api/enrichment/prospeo
└── prospeo-batch.ts # POST /api/enrichment/prospeo-batch
```

## 5.6 Integrations APIs (4)
```
api/integrations/
├── providers.ts    # GET/POST /api/integrations/providers
├── enrich.ts       # POST /api/integrations/enrich
├── usage.ts        # GET /api/integrations/usage
└── waterfalls.ts   # GET/POST /api/integrations/waterfalls
```

## 5.7 Profiles APIs (2)
```
api/profiles/
├── buyer.ts       # GET/POST /api/profiles/buyer
└── provider.ts    # GET/POST /api/profiles/provider
```

## 5.8 Other APIs (2)
```
api/
├── health.ts      # GET /api/health
└── projects/
    └── index.ts   # GET/POST /api/projects
```

---

# SECTION 6: DATABASE SCHEMA (27 Models)

## 6.1 CRM Models

### User
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String
  nameEn        String?
  phone         String?
  avatar        String?
  defaultMode   String    @default("buyer")
  status        String    @default("active")
  emailVerified Boolean   @default(false)
  createdAt     DateTime  @default(now())
  lastLogin     DateTime?
  
  buyerProfile    BuyerProfile?
  providerProfile ProviderProfile?
}
```

### BuyerProfile
```prisma
model BuyerProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  companyName     String
  companyNameEn   String?
  crNumber        String?
  industry        String?
  companySize     String?
  contactName     String
  contactRole     String?
  contactEmail    String
  contactPhone    String?
  city            String?
  country         String
  profileComplete Boolean  @default(false)
  
  projects  Project[]
  shortlist ShortlistItem[]
}
```

### ProviderProfile
```prisma
model ProviderProfile {
  id                String   @id @default(uuid())
  userId            String   @unique
  providerId        String?
  companyName       String
  companyNameEn     String?
  tagline           String?
  description       String?
  valueProposition  String?
  uniqueSellingPoints String[]
  targetAudience    String?
  logoUrl           String?
  coverUrl          String?
  crNumber          String?
  isSaudiVerified   Boolean  @default(false)
  foundedYear       Int?
  companySize       String
  contactName       String
  contactEmail      String
  website           String?
  headquartersCity  String
  serviceLocations  String[]
  linkedinUrl       String?
  serviceLines      Json[]
  industries        Json[]
  certifications    String[]
  tags              String[]
  keywords          String[]
  capabilities      String[]
  preferredPersonas Json?
  disqualifiers     Json?
  capacityScore     Int?
  slaLevel          String?
  status            String   @default("draft")
  profileHealth     Int      @default(0)
  
  clients            ClientReference[]
  projectResponses   ProjectResponse[]
  shortlistedBy      ShortlistItem[]
  ImportJob          ImportJob[]
}
```

### Contact (50+ fields)
```prisma
model Contact {
  id                String   @id @default(uuid())
  first_name        String?
  last_name         String?
  name              String
  email             String   @unique
  phone             String?
  title             String?
  company_name      String
  address1          String?
  city              String?
  state             String?
  country           String?
  postal_code       String?
  timezone          String?
  website           String?
  
  // GHL Custom Fields (30+)
  initial_icebreaker       String?
  industry_2               String?
  function_2               String?
  linkedin_url             String?
  prospect_about           String?
  company_description      String?
  employee_count           String?
  company_country          String?
  arabic_summary           String?
  industry_tier            String?
  title_tier               String?
  final_icp_tier           String?
  b2b_status               String?
  b2b_summary              String?
  // ... and more
  
  // App Specific
  icp_status  String?
  fit_score   Int?
  stage       String?
  tags        String[]
  
  opportunities Opportunity[]
}
```

## 6.2 Data Center Models

### ImportJob
```prisma
model ImportJob {
  id                String           @id @default(uuid())
  sourceConnectorId String?
  recipeId          String?
  icpProfileId      String?
  providerProfileId String?
  status            String  // pending, processing, completed, failed
  startedAt         DateTime?
  finishedAt        DateTime?
  rowCountInput     Int     @default(0)
  rowCountAccepted  Int     @default(0)
  rowCountRejected  Int     @default(0)
  rowCountEnriched  Int     @default(0)
  createdBy         String
  createdAt         DateTime @default(now())
  
  rows StagingRow[]
}
```

### StagingRow
```prisma
model StagingRow {
  id              String    @id @default(uuid())
  importJobId     String
  rawJson         Json
  normalizedJson  Json?
  dedupeKey       String?
  rowStatus       String   // new, validated, enriched, rejected, synced
  rejectionReason String?
  personId        String?
  companyId       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### PersonEntity
```prisma
model PersonEntity {
  id                 String    @id @default(uuid())
  fullName           String?
  firstName          String?
  lastName           String?
  email              String?
  emails             String[]
  phone              String?
  phones             String[]
  linkedinUrl        String?
  linkedinId         String?
  title              String?
  seniority          String?
  department         String?
  locationCity       String?
  locationCountry    String?
  languages          String[]
  verificationStatus String?
  sourceProvider     String?
  sourceRecordId     String?
  firstSeenAt        DateTime @default(now())
  lastSeenAt         DateTime @default(now())
  
  stagingRows    StagingRow[]
  company        CompanyEntity?
  relationships  EntityRelationship[]
  signals        SignalEvent[]
  enrichmentJobs EnrichmentJob[]
  scores         Score[]
}
```

### CompanyEntity
```prisma
model CompanyEntity {
  id                 String   @id @default(uuid())
  companyName        String
  domain             String?  @unique
  linkedinUrl        String?
  linkedinId         String?
  industryTaxonomyId Int?
  employeeCountRange String?
  locationCity       String?
  locationCountry    String?
  techStack          Json?
  signalsSummary     Json?
  sourceProvider     String?
  
  stagingRows    StagingRow[]
  people         PersonEntity[]
  relationships  EntityRelationship[]
  signals        SignalEvent[]
  enrichmentJobs EnrichmentJob[]
  scores         Score[]
}
```

## 6.3 Integration Models

### IntegrationProvider
```prisma
model IntegrationProvider {
  id                 String   @id @default(uuid())
  slug               String   @unique
  name               String
  logoUrl            String?
  capabilities       Json     // {email, phone, company, linkedin}
  configSchema       Json?
  encryptedApiKey    String?  // AES-256-GCM
  encryptedApiKeyIv  String?
  status             String   @default("inactive")
  lastTestAt         DateTime?
  lastTestStatus     String?
  lastTestMessage    String?
  totalCreditsUsed   Int      @default(0)
  monthlyCreditsUsed Int      @default(0)
  monthlyResetAt     DateTime?
  
  waterfallSteps WaterfallStep[]
  usageLogs      ProviderUsageLog[]
}
```

### EnrichmentWaterfall
```prisma
model EnrichmentWaterfall {
  id               String   @id @default(uuid())
  name             String
  slug             String   @unique
  enrichmentType   String   // email, phone, company, linkedin
  description      String?
  stopOnFirstMatch Boolean  @default(true)
  maxProviders     Int      @default(3)
  isActive         Boolean  @default(true)
  
  steps WaterfallStep[]
}
```

## 6.4 Wallet Models

### WorkspaceWallet
```prisma
model WorkspaceWallet {
  id                 String   @id @default(uuid())
  workspaceId        String   @unique
  creditBalance      Float    @default(0)
  reservedCredits    Float    @default(0)
  monthlyLimit       Float?
  dailyLimit         Float?
  billingCycle       String   @default("monthly")
  currentPeriodStart DateTime @default(now())
  currentPeriodEnd   DateTime?
  status             String   @default("active")
  
  transactions   WalletTransaction[]
  creditPolicies CreditPolicy[]
}
```

### WalletTransaction
```prisma
model WalletTransaction {
  id           String   @id @default(uuid())
  walletId     String
  type         String   // credit_add, credit_use, refund, adjustment
  amount       Float
  balanceAfter Float
  providerId   String?
  requestType  String?
  entityId     String?
  description  String?
  performedBy  String?
  metadata     Json?
  createdAt    DateTime @default(now())
}
```

### CreditPolicy
```prisma
model CreditPolicy {
  id               String   @id @default(uuid())
  walletId         String
  providerSlug     String
  enabled          Boolean  @default(false)
  dailyLimit       Int?
  monthlyLimit     Int?
  usedToday        Int      @default(0)
  usedThisMonth    Int      @default(0)
  unitCostOverride Float?
  allowedFeatures  String[]
  overagePolicy    String   @default("stop")
}
```

---

# SECTION 7: LAYOUTS (3 Files)

## MainLayout.tsx
- **Route:** `/app/*`
- **Features:** Sidebar navigation, user header, RTL support
- **Sidebar Items:** Dashboard, Profile, Diagnosis, Contacts, Leads, Opportunities, Data Center, Projects, Messages, Financial, Reviews, Integrations

## AdminLayout.tsx
- **Route:** `/admin/*`
- **Features:** Admin sidebar, breadcrumbs
- **Sidebar Items:** Dashboard, Integrations, Wallet, Workspaces, Audit, Ninja, Providers

## DataCenterLayout.tsx
- **Route:** `/app/data-center/*`
- **Features:** Pipeline tab navigation, stage indicators
- **Tabs:** Overview, Import, Enrich, ICP, Contactability, Campaign, Database

---

# SECTION 8: CONTEXT & MIDDLEWARE

## DataContext.tsx (11KB)
```typescript
interface DataContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  contacts: Contact[];
  setContacts: (contacts: Contact[]) => void;
  opportunities: Opportunity[];
  setOpportunities: (opps: Opportunity[]) => void;
  // ... more state
}
```

## middleware/adminAuth.ts (6KB)
- JWT validation
- Admin role verification
- Session management

---

# SECTION 9: TYPE DEFINITIONS

## types/data-center.ts (4KB)
```typescript
export interface ImportJob { ... }
export interface StagingRow { ... }
export interface FieldMapping { ... }
export type ImportStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type RowStatus = 'new' | 'validated' | 'enriched' | 'rejected' | 'synced';
```

## types/lemlist.ts (8KB)
```typescript
export interface LemlistPerson { ... }
export interface LemlistSearchParams { ... }
export interface LemlistSearchResponse { ... }
export interface LemlistEnrichmentParams { ... }
export interface LemlistEnrichmentResponse { ... }
export interface LemlistEnrichmentResult { ... }
export interface LemlistFilterOption { ... }
export type EnrichmentStrategy = 'linkedin' | 'email' | 'name_domain' | 'name_company';
export interface SmartEnrichmentOptions { ... }
export interface ParsedEnrichmentResult { ... }
```

---

# SECTION 10: SCRIPTS

## scripts/simulate_provider_flow.ts (14KB)
- Generates mock provider data
- Simulates import → normalize → enrich → ICP flow
- Used for development and demos

---

# SUMMARY STATISTICS

| Category | Count | Notes |
|----------|-------|-------|
| **TypeScript Files** | 185 | Total `.ts` + `.tsx` |
| **Pages** | 37 | Public + App + DataCenter + Admin |
| **Components** | 39 | Reusable UI components |
| **Services** | 60+ | Business logic |
| **API Endpoints** | 26 | Vercel serverless functions |
| **Layouts** | 3 | Main, Admin, DataCenter |
| **Database Models** | 27 | Prisma schema |
| **Provider Adapters** | 17 | Integration adapters |
| **Routes** | 30 | Client-side routes |
| **Context Providers** | 1 | DataContext |
| **Type Files** | 5 | Type definitions |
