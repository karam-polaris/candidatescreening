import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as Papa from 'papaparse';
import { v4 as uuidv4 } from 'uuid';
import {
  CandidateIngestSchema,
  ApplicationIngestSchema,
  AssessmentIngestSchema
} from '@candidate-screening/domain';

@Injectable()
export class IngestService {
  constructor(private prisma: PrismaService) {}

  /**
   * Parse CSV content to JSON
   */
  private parseCSV(content: string): any[] {
    const result = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });

    if (result.errors.length > 0) {
      throw new Error(`CSV parse errors: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  /**
   * Parse JSONL content to JSON array
   */
  private parseJSONL(content: string): any[] {
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
  }

  /**
   * Ingest candidates from JSONL
   */
  async ingestCandidates(content: string, format: 'jsonl' | 'json' = 'jsonl'): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const records = format === 'jsonl' ? this.parseJSONL(content) : JSON.parse(content);
      const candidatesArray = Array.isArray(records) ? records : [records];

      for (const record of candidatesArray) {
        try {
          // Validate with Zod
          const validated = CandidateIngestSchema.parse(record);

          // Ensure we have a candidate_id
          const candidateId = validated.candidate_id || uuidv4();

          // Upsert candidate
          await this.prisma.candidate.upsert({
            where: { id: candidateId },
            update: {
              fullName: validated.full_name,
              emails: validated.emails || [],
              phones: validated.phones || [],
              location: validated.location,
              workAuth: validated.work_auth,
              currentTitle: validated.current_title,
              totalExperienceYears: validated.total_experience_years,
              skills: validated.skills as any,
              seniority: validated.seniority,
              education: validated.education as any,
              experienceSummary: validated.experience_summary,
              sources: validated.sources as any
            },
            create: {
              id: candidateId,
              fullName: validated.full_name,
              emails: validated.emails || [],
              phones: validated.phones || [],
              location: validated.location,
              workAuth: validated.work_auth,
              currentTitle: validated.current_title,
              totalExperienceYears: validated.total_experience_years,
              skills: validated.skills as any,
              seniority: validated.seniority,
              education: validated.education as any,
              experienceSummary: validated.experience_summary,
              sources: validated.sources as any
            }
          });

          count++;
        } catch (error) {
          errors.push(`Row error: ${error.message}`);
        }
      }

      return { count, errors };
    } catch (error) {
      throw new Error(`Failed to ingest candidates: ${error.message}`);
    }
  }

  /**
   * Ingest applications from CSV
   */
  async ingestApplications(content: string): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const records = this.parseCSV(content);

      for (const record of records) {
        try {
          // Convert Date objects to ISO strings (Papa.parse with dynamicTyping converts dates)
          const normalizedRecord = { ...record };
          if (normalizedRecord.submitted_at instanceof Date) {
            normalizedRecord.submitted_at = normalizedRecord.submitted_at.toISOString();
          }
          if (normalizedRecord.recruiter_notes === null || normalizedRecord.recruiter_notes === undefined) {
            normalizedRecord.recruiter_notes = '';
          }
          
          // Validate with Zod
          const validated = ApplicationIngestSchema.parse(normalizedRecord);

          // Ensure we have an application_id
          const applicationId = validated.application_id || uuidv4();

          // Create or update application
          await this.prisma.application.upsert({
            where: { id: applicationId },
            update: {
              jobId: validated.job_id,
              candidateId: validated.candidate_id,
              source: validated.source,
              submittedAt: validated.submitted_at ? new Date(validated.submitted_at) : null,
              stage: validated.stage || 'applied',
              recruiterNotes: validated.recruiter_notes
            },
            create: {
              id: applicationId,
              jobId: validated.job_id,
              candidateId: validated.candidate_id,
              source: validated.source,
              submittedAt: validated.submitted_at ? new Date(validated.submitted_at) : null,
              stage: validated.stage || 'applied',
              recruiterNotes: validated.recruiter_notes
            }
          });

          count++;
        } catch (error) {
          errors.push(`Row error: ${error.message}`);
        }
      }

      return { count, errors };
    } catch (error) {
      throw new Error(`Failed to ingest applications: ${error.message}`);
    }
  }

  /**
   * Ingest profiles from CSV or JSONL
   */
  async ingestProfiles(content: string, format: 'csv' | 'jsonl'): Promise<{ count: number; errors: string[] }> {
    // Profiles are essentially candidates from external systems
    if (format === 'csv') {
      const errors: string[] = [];
      let count = 0;

      const records = this.parseCSV(content);

      for (const record of records) {
        try {
          // Transform CSV profile to candidate format
          const candidateData = {
            candidate_id: record.candidate_id || record.profile_id,
            full_name: record.full_name || record.name,
            emails: record.email ? [record.email] : [],
            phones: record.phone ? [record.phone] : [],
            location: record.location,
            work_auth: record.work_auth,
            current_title: record.current_title || record.title,
            total_experience_years: record.total_experience_years || record.experience_years,
            skills: record.skills ? (typeof record.skills === 'string' ? JSON.parse(record.skills) : record.skills) : [],
            seniority: record.seniority,
            sources: [{ system: 'profiles', id: record.profile_id }]
          };

          const validated = CandidateIngestSchema.parse(candidateData);
          const candidateId = validated.candidate_id || uuidv4();

          await this.prisma.candidate.upsert({
            where: { id: candidateId },
            update: {
              fullName: validated.full_name,
              emails: validated.emails || [],
              phones: validated.phones || [],
              location: validated.location,
              workAuth: validated.work_auth,
              currentTitle: validated.current_title,
              totalExperienceYears: validated.total_experience_years,
              skills: validated.skills as any,
              seniority: validated.seniority,
              sources: validated.sources as any
            },
            create: {
              id: candidateId,
              fullName: validated.full_name,
              emails: validated.emails || [],
              phones: validated.phones || [],
              location: validated.location,
              workAuth: validated.work_auth,
              currentTitle: validated.current_title,
              totalExperienceYears: validated.total_experience_years,
              skills: validated.skills as any,
              seniority: validated.seniority,
              sources: validated.sources as any
            }
          });

          count++;
        } catch (error) {
          errors.push(`Row error: ${error.message}`);
        }
      }

      return { count, errors };
    } else {
      // JSONL format
      return this.ingestCandidates(content, 'jsonl');
    }
  }

  /**
   * Ingest assessments from CSV or JSONL
   */
  async ingestAssessments(content: string, format: 'csv' | 'jsonl'): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const records = format === 'csv' ? this.parseCSV(content) : this.parseJSONL(content);

      for (const record of records) {
        try {
          // Parse JSON fields if they're strings
          if (typeof record.subscores === 'string') {
            record.subscores = JSON.parse(record.subscores);
          }
          if (typeof record.competency_map === 'string') {
            record.competency_map = JSON.parse(record.competency_map);
          }

          // Validate with Zod
          const validated = AssessmentIngestSchema.parse(record);

          // Ensure we have an assessment_id
          const assessmentId = validated.assessment_id || uuidv4();

          // Create or update assessment
          await this.prisma.assessment.upsert({
            where: { id: assessmentId },
            update: {
              candidateId: validated.candidate_id,
              type: validated.type,
              provider: validated.provider,
              score: validated.score,
              subscores: validated.subscores as any,
              completedAt: validated.completed_at ? new Date(validated.completed_at) : null,
              competencyMap: validated.competency_map as any
            },
            create: {
              id: assessmentId,
              candidateId: validated.candidate_id,
              type: validated.type,
              provider: validated.provider,
              score: validated.score,
              subscores: validated.subscores as any,
              completedAt: validated.completed_at ? new Date(validated.completed_at) : null,
              competencyMap: validated.competency_map as any
            }
          });

          count++;
        } catch (error) {
          errors.push(`Row error: ${error.message}`);
        }
      }

      return { count, errors };
    } catch (error) {
      throw new Error(`Failed to ingest assessments: ${error.message}`);
    }
  }
}
