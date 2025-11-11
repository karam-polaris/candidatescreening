import { z } from 'zod';

// Skill level enum
export const SkillLevelSchema = z.enum(['basic', 'intermediate', 'advanced']);
export type SkillLevel = z.infer<typeof SkillLevelSchema>;

// Seniority enum
export const SenioritySchema = z.enum(['junior', 'mid', 'senior', 'lead']);
export type Seniority = z.infer<typeof SenioritySchema>;

// Assessment type enum
export const AssessmentTypeSchema = z.enum(['coding', 'cognitive', 'language', 'domain']);
export type AssessmentType = z.infer<typeof AssessmentTypeSchema>;

// Application stage enum
export const ApplicationStageSchema = z.enum([
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'withdrawn'
]);
export type ApplicationStage = z.infer<typeof ApplicationStageSchema>;

// Skill schema
export const SkillSchema = z.object({
  name: z.string(),
  level: SkillLevelSchema.optional(),
  last_used: z.number().int().optional(), // Year
  years: z.number().optional() // Years of experience with this skill
});
export type Skill = z.infer<typeof SkillSchema>;

// Education schema
export const EducationSchema = z.object({
  degree: z.string().optional(),
  year: z.number().int().optional(),
  school: z.string().optional()
});
export type Education = z.infer<typeof EducationSchema>;

// Source schema
export const SourceSchema = z.object({
  system: z.enum(['candidates', 'profiles', 'assessments', 'applications']),
  id: z.string().optional()
});
export type Source = z.infer<typeof SourceSchema>;

// Competency schema (for Job)
export const CompetencySchema = z.object({
  name: z.string(),
  weight: z.number().min(0).max(1),
  mustHave: z.boolean().optional()
});
export type Competency = z.infer<typeof CompetencySchema>;

// Hard filters schema (for Job)
export const HardFiltersSchema = z.object({
  min_total_exp_years: z.number().optional(),
  work_auth: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional()
});
export type HardFilters = z.infer<typeof HardFiltersSchema>;

// Job schema
export const JobSchema = z.object({
  job_id: z.string(),
  title: z.string(),
  location: z.string().optional(),
  competencies: z.array(CompetencySchema),
  hardFilters: HardFiltersSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type Job = z.infer<typeof JobSchema>;

// Job create/update schema (without auto-generated fields)
export const JobCreateSchema = JobSchema.omit({
  job_id: true,
  created_at: true,
  updated_at: true
});
export type JobCreate = z.infer<typeof JobCreateSchema>;

export const JobUpdateSchema = JobCreateSchema.partial();
export type JobUpdate = z.infer<typeof JobUpdateSchema>;

// Candidate schema
export const CandidateSchema = z.object({
  candidate_id: z.string(),
  full_name: z.string(),
  emails: z.array(z.string().email()).optional(),
  phones: z.array(z.string()).optional(),
  location: z.string().optional(),
  work_auth: z.string().optional(),
  current_title: z.string().optional(),
  total_experience_years: z.number().optional(),
  skills: z.array(SkillSchema),
  seniority: SenioritySchema.optional(),
  education: z.array(EducationSchema).optional(),
  experience_summary: z.string().optional(),
  sources: z.array(SourceSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type Candidate = z.infer<typeof CandidateSchema>;

// Candidate ingest schema (for JSONL import)
export const CandidateIngestSchema = CandidateSchema.omit({
  created_at: true,
  updated_at: true
}).partial({ candidate_id: true }); // candidate_id can be auto-generated
export type CandidateIngest = z.infer<typeof CandidateIngestSchema>;

// Application schema
export const ApplicationSchema = z.object({
  application_id: z.string(),
  job_id: z.string(),
  candidate_id: z.string(),
  source: z.string().optional(),
  submitted_at: z.string().optional(),
  stage: ApplicationStageSchema.optional(),
  recruiter_notes: z.string().optional(),
  created_at: z.string().optional()
});
export type Application = z.infer<typeof ApplicationSchema>;

// Application ingest schema (for CSV import)
export const ApplicationIngestSchema = ApplicationSchema.omit({
  created_at: true
}).partial({ application_id: true });
export type ApplicationIngest = z.infer<typeof ApplicationIngestSchema>;

// Assessment subscore schema
export const AssessmentSubscoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(100)
});
export type AssessmentSubscore = z.infer<typeof AssessmentSubscoreSchema>;

// Competency mapping for assessments
export const CompetencyMappingSchema = z.object({
  competency: z.string(),
  weight: z.number().optional()
});
export type CompetencyMapping = z.infer<typeof CompetencyMappingSchema>;

// Assessment schema
export const AssessmentSchema = z.object({
  assessment_id: z.string(),
  candidate_id: z.string(),
  type: AssessmentTypeSchema,
  provider: z.string().optional(),
  score: z.number().min(0).max(100),
  subscores: z.array(AssessmentSubscoreSchema).optional(),
  completed_at: z.string().optional(),
  competency_map: z.array(CompetencyMappingSchema).optional(),
  created_at: z.string().optional()
});
export type Assessment = z.infer<typeof AssessmentSchema>;

// Assessment ingest schema
export const AssessmentIngestSchema = AssessmentSchema.omit({
  created_at: true
}).partial({ assessment_id: true });
export type AssessmentIngest = z.infer<typeof AssessmentIngestSchema>;

// Competency score (for FitSnapshot)
export const CompetencyScoreSchema = z.object({
  name: z.string(),
  score: z.number().min(0).max(1),
  evidence: z.array(z.string())
});
export type CompetencyScore = z.infer<typeof CompetencyScoreSchema>;

// FitSnapshot schema
export const FitSnapshotSchema = z.object({
  snapshot_id: z.string(),
  job_id: z.string(),
  candidate_id: z.string(),
  overall: z.number().min(0).max(1),
  byCompetency: z.array(CompetencyScoreSchema),
  redFlags: z.array(z.string()),
  explainAtoms: z.array(z.string()),
  calibrationVersion: z.string(),
  created_at: z.string()
});
export type FitSnapshot = z.infer<typeof FitSnapshotSchema>;

// Chat message schemas
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string()
});
export type ChatMessage = z.infer<typeof ChatMessageSchema>;

// Tool call schemas for chat copilot
export const CompareCandidatesParamsSchema = z.object({
  jobId: z.string(),
  candidateIds: z.array(z.string()),
  overrides: z.record(z.any()).optional()
});
export type CompareCandidatesParams = z.infer<typeof CompareCandidatesParamsSchema>;

export const ExplainScoreParamsSchema = z.object({
  jobId: z.string(),
  candidateId: z.string(),
  detail: z.string().optional()
});
export type ExplainScoreParams = z.infer<typeof ExplainScoreParamsSchema>;

export const WhatIfCalibrationParamsSchema = z.object({
  jobId: z.string(),
  delta: z.object({
    weights: z.record(z.number()).optional(),
    mustHaves: z.record(z.boolean()).optional(),
    filters: HardFiltersSchema.optional()
  })
});
export type WhatIfCalibrationParams = z.infer<typeof WhatIfCalibrationParamsSchema>;

export const FilterCandidatesParamsSchema = z.object({
  jobId: z.string(),
  filters: z.object({
    skills: z.array(z.string()).optional(),
    min_experience: z.number().optional(),
    location: z.string().optional(),
    work_auth: z.string().optional(),
    min_assessment_score: z.number().optional()
  })
});
export type FilterCandidatesParams = z.infer<typeof FilterCandidatesParamsSchema>;

// Job template schema
export const JobTemplateSchema = z.object({
  template_id: z.string(),
  name: z.string(),
  competencies: z.array(CompetencySchema),
  hardFilters: HardFiltersSchema.optional(),
  created_at: z.string()
});
export type JobTemplate = z.infer<typeof JobTemplateSchema>;

export const JobTemplateCreateSchema = JobTemplateSchema.omit({
  template_id: true,
  created_at: true
});
export type JobTemplateCreate = z.infer<typeof JobTemplateCreateSchema>;
