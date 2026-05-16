-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameEn" TEXT,
    "phone" TEXT,
    "avatar" TEXT,
    "defaultMode" TEXT NOT NULL DEFAULT 'buyer',
    "status" TEXT NOT NULL DEFAULT 'active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BuyerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyNameEn" TEXT,
    "crNumber" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "contactName" TEXT NOT NULL,
    "contactRole" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL,
    "profileComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuyerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerId" TEXT,
    "companyName" TEXT NOT NULL,
    "companyNameEn" TEXT,
    "tagline" TEXT,
    "taglineEn" TEXT,
    "description" TEXT,
    "descriptionEn" TEXT,
    "valueProposition" TEXT,
    "uniqueSellingPoints" TEXT[],
    "targetAudience" TEXT,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "crNumber" TEXT,
    "isSaudiVerified" BOOLEAN NOT NULL DEFAULT false,
    "foundedYear" INTEGER,
    "companySize" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactRole" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "website" TEXT,
    "headquartersCity" TEXT NOT NULL,
    "headquartersCountry" TEXT NOT NULL,
    "serviceLocations" TEXT[],
    "linkedinUrl" TEXT,
    "twitterUrl" TEXT,
    "serviceLines" JSONB[],
    "industries" JSONB[],
    "idealClientDescription" TEXT,
    "minProjectSize" INTEGER,
    "maxProjectSize" INTEGER,
    "preferredProjectDuration" TEXT,
    "certifications" TEXT[],
    "tags" TEXT[],
    "keywords" TEXT[],
    "capabilities" TEXT[],
    "preferredPersonas" JSONB,
    "disqualifiers" JSONB,
    "capacityScore" INTEGER,
    "slaLevel" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "profileHealth" INTEGER NOT NULL DEFAULT 0,
    "submittedForReviewAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProviderProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientReference" (
    "id" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "projectDescription" TEXT,
    "projectType" TEXT,
    "year" INTEGER,
    "testimonial" TEXT,
    "challenge" TEXT,
    "solution" TEXT,
    "results" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "serviceCategoryId" INTEGER,
    "subserviceId" INTEGER,
    "industrySectorId" INTEGER,
    "subIndustryId" INTEGER,

    CONSTRAINT "ClientReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "buyerProfileId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "description" TEXT NOT NULL,
    "descriptionEn" TEXT,
    "deliverables" TEXT[],
    "goals" TEXT[],
    "attachments" JSONB[],
    "budgetBand" TEXT NOT NULL,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "timelineStart" TIMESTAMP(3),
    "timelineEnd" TIMESTAMP(3),
    "urgency" TEXT NOT NULL,
    "preferredLocations" TEXT[],
    "remoteOk" BOOLEAN NOT NULL DEFAULT true,
    "saudiPresenceRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "invitedProviders" TEXT[],
    "excludedProviders" TEXT[],
    "responsesCount" INTEGER NOT NULL DEFAULT 0,
    "meetingsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectResponse" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "interestNote" TEXT,
    "declineReason" TEXT,
    "proposedBudget" INTEGER,
    "proposedTimeline" TEXT,
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageThread" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "buyerUserId" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "lastMessage" TEXT,
    "lastMessageAt" TIMESTAMP(3),
    "lastSenderType" TEXT,
    "buyerUnread" INTEGER NOT NULL DEFAULT 0,
    "providerUnread" INTEGER NOT NULL DEFAULT 0,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "isPriority" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderType" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachments" JSONB[],
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Meeting" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "threadId" TEXT,
    "buyerUserId" TEXT NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "proposedTimes" TEXT[],
    "scheduledAt" TIMESTAMP(3),
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "meetingType" TEXT NOT NULL,
    "meetingLink" TEXT,
    "meetingLocation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'requested',
    "buyerNotes" TEXT,
    "providerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShortlistItem" (
    "id" TEXT NOT NULL,
    "buyerProfileId" TEXT NOT NULL,
    "providerProfileId" TEXT NOT NULL,
    "notes" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShortlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "link" TEXT,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "title" TEXT,
    "company_name" TEXT NOT NULL,
    "address1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "postal_code" TEXT,
    "timezone" TEXT,
    "website" TEXT,
    "initial_icebreaker" TEXT,
    "industry_2" TEXT,
    "function_2" TEXT,
    "company_official_name" TEXT,
    "title_description" TEXT,
    "linkedin_url" TEXT,
    "prospect_about" TEXT,
    "company_description" TEXT,
    "phone_2" TEXT,
    "size_2" TEXT,
    "source" TEXT NOT NULL,
    "record_id" TEXT,
    "about" TEXT,
    "company_linkedin_url" TEXT,
    "linkedin_company_url" TEXT,
    "open_profile" TEXT,
    "premium" TEXT,
    "linkedin_sales_navigator" TEXT,
    "date_of_birth" TEXT,
    "employee_count" TEXT,
    "company_country" TEXT,
    "arabic_summary" TEXT,
    "call_recordings" TEXT,
    "lowercase_business_name" TEXT,
    "type" TEXT,
    "welcome_message" TEXT,
    "follow_up_1" TEXT,
    "follow_up_2" TEXT,
    "follow_up_3" TEXT,
    "follow_up_4" TEXT,
    "subcategory" TEXT,
    "sub_subcategory" TEXT,
    "manufacture" TEXT,
    "annual_revenue" TEXT,
    "phone_updated" TEXT,
    "profile_unique_id" TEXT,
    "li_messages" TEXT,
    "company_location" TEXT,
    "third_scene" TEXT,
    "subject_f1" TEXT,
    "subject_f2" TEXT,
    "subject_f3" TEXT,
    "third_scene_subject" TEXT,
    "industry_tier" TEXT,
    "title_tier" TEXT,
    "final_icp_tier" TEXT,
    "industry_ar" TEXT,
    "field_ar" TEXT,
    "profile" TEXT,
    "b2b_status" TEXT,
    "industry_22" TEXT,
    "b2b_summary" TEXT,
    "icp_status" TEXT,
    "fit_score" INTEGER,
    "stage" TEXT,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Business" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "address" TEXT,
    "state" TEXT,
    "city" TEXT,
    "description" TEXT,
    "postal_code" TEXT,
    "country" TEXT,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opportunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pipeline_id" TEXT NOT NULL,
    "pipeline_stage_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "monetary_value" DOUBLE PRECISION,
    "assigned_to" TEXT,
    "source" TEXT,
    "lost_reason" TEXT,
    "call_record_url" TEXT,
    "feedback" TEXT,
    "contact_id" TEXT,
    "business_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ICPProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "targetIndustries" INTEGER[],
    "companySizeMin" INTEGER,
    "companySizeMax" INTEGER,
    "geos" TEXT[],
    "personas" JSONB,
    "exclusions" JSONB,
    "signalWeights" JSONB,
    "scoringWeights" JSONB,
    "createdBy" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ICPProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SourceConnector" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authRef" TEXT,
    "rateLimits" JSONB,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "SourceConnector_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "inputSchema" JSONB,
    "steps" JSONB NOT NULL,
    "outputSchema" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldMapping" (
    "id" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "mappingName" TEXT NOT NULL,
    "mappings" JSONB NOT NULL,
    "transforms" JSONB,
    "validations" JSONB,

    CONSTRAINT "FieldMapping_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImportJob" (
    "id" TEXT NOT NULL,
    "sourceConnectorId" TEXT,
    "recipeId" TEXT,
    "icpProfileId" TEXT,
    "providerProfileId" TEXT,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "rowCountInput" INTEGER NOT NULL DEFAULT 0,
    "rowCountAccepted" INTEGER NOT NULL DEFAULT 0,
    "rowCountRejected" INTEGER NOT NULL DEFAULT 0,
    "rowCountEnriched" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StagingRow" (
    "id" TEXT NOT NULL,
    "importJobId" TEXT NOT NULL,
    "rawJson" JSONB NOT NULL,
    "normalizedJson" JSONB,
    "dedupeKey" TEXT,
    "rowStatus" TEXT NOT NULL,
    "rejectionReason" TEXT,
    "personId" TEXT,
    "companyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StagingRow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PersonEntity" (
    "id" TEXT NOT NULL,
    "fullName" TEXT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "emails" TEXT[],
    "phone" TEXT,
    "phones" TEXT[],
    "linkedinUrl" TEXT,
    "linkedinId" TEXT,
    "title" TEXT,
    "seniority" TEXT,
    "department" TEXT,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "languages" TEXT[],
    "verificationStatus" TEXT,
    "sourceProvider" TEXT,
    "sourceRecordId" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT,

    CONSTRAINT "PersonEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyEntity" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "domain" TEXT,
    "linkedinUrl" TEXT,
    "linkedinId" TEXT,
    "industryTaxonomyId" INTEGER,
    "employeeCountRange" TEXT,
    "locationCity" TEXT,
    "locationCountry" TEXT,
    "techStack" JSONB,
    "signalsSummary" JSONB,
    "sourceProvider" TEXT,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompanyEntity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntityRelationship" (
    "id" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "role" TEXT,
    "title" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "confidenceScore" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EntityRelationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrichmentJob" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "personId" TEXT,
    "companyId" TEXT,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "retries" INTEGER NOT NULL DEFAULT 0,
    "costUnits" INTEGER NOT NULL DEFAULT 0,
    "resultJson" JSONB,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EnrichmentJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalEvent" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "personId" TEXT,
    "companyId" TEXT,
    "type" TEXT NOT NULL,
    "source" TEXT,
    "evidenceUrl" TEXT,
    "detectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "impactScore" INTEGER,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignalEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "personId" TEXT,
    "companyId" TEXT,
    "fitScore" INTEGER NOT NULL DEFAULT 0,
    "intentScore" INTEGER NOT NULL DEFAULT 0,
    "engagementScore" INTEGER NOT NULL DEFAULT 0,
    "finalScore" INTEGER NOT NULL DEFAULT 0,
    "scoringVersion" TEXT NOT NULL DEFAULT '1.0',
    "computedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BuyerProfile_userId_key" ON "BuyerProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderProfile_userId_key" ON "ProviderProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Contact_email_key" ON "Contact"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyEntity_domain_key" ON "CompanyEntity"("domain");

-- AddForeignKey
ALTER TABLE "BuyerProfile" ADD CONSTRAINT "BuyerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderProfile" ADD CONSTRAINT "ProviderProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientReference" ADD CONSTRAINT "ClientReference_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_buyerProfileId_fkey" FOREIGN KEY ("buyerProfileId") REFERENCES "BuyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResponse" ADD CONSTRAINT "ProjectResponse_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectResponse" ADD CONSTRAINT "ProjectResponse_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistItem" ADD CONSTRAINT "ShortlistItem_buyerProfileId_fkey" FOREIGN KEY ("buyerProfileId") REFERENCES "BuyerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShortlistItem" ADD CONSTRAINT "ShortlistItem_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_contact_id_fkey" FOREIGN KEY ("contact_id") REFERENCES "Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_business_id_fkey" FOREIGN KEY ("business_id") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_sourceConnectorId_fkey" FOREIGN KEY ("sourceConnectorId") REFERENCES "SourceConnector"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_icpProfileId_fkey" FOREIGN KEY ("icpProfileId") REFERENCES "ICPProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImportJob" ADD CONSTRAINT "ImportJob_providerProfileId_fkey" FOREIGN KEY ("providerProfileId") REFERENCES "ProviderProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingRow" ADD CONSTRAINT "StagingRow_importJobId_fkey" FOREIGN KEY ("importJobId") REFERENCES "ImportJob"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingRow" ADD CONSTRAINT "StagingRow_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StagingRow" ADD CONSTRAINT "StagingRow_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonEntity" ADD CONSTRAINT "PersonEntity_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntityRelationship" ADD CONSTRAINT "EntityRelationship_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrichmentJob" ADD CONSTRAINT "EnrichmentJob_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrichmentJob" ADD CONSTRAINT "EnrichmentJob_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalEvent" ADD CONSTRAINT "SignalEvent_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalEvent" ADD CONSTRAINT "SignalEvent_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_personId_fkey" FOREIGN KEY ("personId") REFERENCES "PersonEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "CompanyEntity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
