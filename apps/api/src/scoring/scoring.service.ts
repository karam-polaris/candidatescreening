import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobsService } from '../jobs/jobs.service';
import { scoreCandidate } from '@candidate-screening/scoring';
import { v4 as uuidv4 } from 'uuid';
import type { Job, Candidate, Assessment } from '@candidate-screening/domain';

@Injectable()
export class ScoringService {
  constructor(
    private prisma: PrismaService,
    private jobsService: JobsService
  ) {}

  /**
   * Score all candidates for a job
   */
  async scoreBatch(jobId: string, calibrationVersion?: string) {
    const job = await this.jobsService.findOne(jobId);

    // Get all candidates
    const candidates = await this.prisma.candidate.findMany();

    // Get all assessments
    const assessments = await this.prisma.assessment.findMany({
      where: {
        candidateId: { in: candidates.map((c) => c.id) }
      }
    });

    // Group assessments by candidate
    const assessmentMap = new Map<string, Assessment[]>();
    for (const assessment of assessments) {
      if (!assessmentMap.has(assessment.candidateId)) {
        assessmentMap.set(assessment.candidateId, []);
      }

      assessmentMap.get(assessment.candidateId)!.push({
        assessment_id: assessment.id,
        candidate_id: assessment.candidateId,
        type: assessment.type as any,
        provider: assessment.provider || undefined,
        score: assessment.score,
        subscores: assessment.subscores as any,
        completed_at: assessment.completedAt?.toISOString(),
        competency_map: assessment.competencyMap as any,
        created_at: assessment.createdAt.toISOString()
      });
    }

    const snapshots: any[] = [];
    let scored = 0;
    let excluded = 0;

    for (const candidateData of candidates) {
      const candidate: Candidate = {
        candidate_id: candidateData.id,
        full_name: candidateData.fullName,
        emails: candidateData.emails,
        phones: candidateData.phones,
        location: candidateData.location || undefined,
        work_auth: candidateData.workAuth || undefined,
        current_title: candidateData.currentTitle || undefined,
        total_experience_years: candidateData.totalExperienceYears || undefined,
        skills: candidateData.skills as any,
        seniority: candidateData.seniority as any,
        education: candidateData.education as any,
        experience_summary: candidateData.experienceSummary || undefined,
        sources: candidateData.sources as any
      };

      const candidateAssessments = assessmentMap.get(candidate.candidate_id) || [];

      const snapshot = scoreCandidate({
        job,
        candidate,
        assessments: candidateAssessments,
        calibrationVersion: calibrationVersion || 'v1'
      });

      if (snapshot) {
        snapshots.push({
          ...snapshot,
          snapshot_id: uuidv4()
        });
        scored++;
      } else {
        excluded++;
      }
    }

    // Delete existing snapshots for this job
    await this.prisma.fitSnapshot.deleteMany({
      where: { jobId }
    });

    // Insert new snapshots
    if (snapshots.length > 0) {
      await this.prisma.fitSnapshot.createMany({
        data: snapshots.map((s) => ({
          id: s.snapshot_id,
          jobId: s.job_id,
          candidateId: s.candidate_id,
          overall: s.overall,
          byCompetency: s.byCompetency as any,
          redFlags: s.redFlags,
          explainAtoms: s.explainAtoms,
          calibrationVersion: s.calibrationVersion
        }))
      });
    }

    return {
      success: true,
      scored,
      excluded,
      total: candidates.length
    };
  }

  /**
   * Get scored candidates for a job with filters
   */
  async getScoredCandidates(
    jobId: string,
    filters?: {
      skills?: string[];
      min_experience?: number;
      location?: string;
      work_auth?: string;
      min_fit?: number;
      min_assessment_score?: number;
    },
    sort?: string,
    order?: 'asc' | 'desc'
  ) {
    const snapshots = await this.prisma.fitSnapshot.findMany({
      where: { jobId },
      include: {
        candidate: true
      }
    });

    // Apply filters
    let filtered = snapshots;

    if (filters) {
      if (filters.min_fit !== undefined) {
        const minFit = filters.min_fit;
        filtered = filtered.filter((s) => s.overall >= minFit);
      }

      if (filters.min_experience !== undefined) {
        const minExp = filters.min_experience;
        filtered = filtered.filter(
          (s) =>
            s.candidate.totalExperienceYears &&
            s.candidate.totalExperienceYears >= minExp
        );
      }

      if (filters.location) {
        const locationFilter = filters.location.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.candidate.location &&
            s.candidate.location
              .toLowerCase()
              .includes(locationFilter)
        );
      }

      if (filters.work_auth) {
        const workAuthFilter = filters.work_auth;
        filtered = filtered.filter(
          (s) => s.candidate.workAuth === workAuthFilter
        );
      }

      if (filters.skills && filters.skills.length > 0) {
        const skillsFilter = filters.skills;
        filtered = filtered.filter((s) => {
          const candidateSkills = (s.candidate.skills as any[]).map((sk: any) =>
            sk.name.toLowerCase()
          );
          return skillsFilter.some((skill) =>
            candidateSkills.includes(skill.toLowerCase())
          );
        });
      }

      if (filters.min_assessment_score !== undefined) {
        const minScore = filters.min_assessment_score;
        const candidateIds = filtered.map((s) => s.candidate.id);
        const assessments = await this.prisma.assessment.findMany({
          where: { candidateId: { in: candidateIds } }
        });

        const assessmentMap = new Map<string, number>();
        assessments.forEach((a) => {
          const existing = assessmentMap.get(a.candidateId) || 0;
          assessmentMap.set(a.candidateId, Math.max(existing, a.score));
        });

        filtered = filtered.filter(
          (s) => {
            const score = assessmentMap.get(s.candidate.id);
            return score !== undefined && score >= minScore;
          }
        );
      }
    }

    // Sort
    const sortField = sort || 'overall';
    const sortOrder = order || 'desc';

    filtered.sort((a, b) => {
      let aVal: any = a.overall;
      let bVal: any = b.overall;

      if (sortField === 'name') {
        aVal = a.candidate.fullName;
        bVal = b.candidate.fullName;
      } else if (sortField === 'experience') {
        aVal = a.candidate.totalExperienceYears || 0;
        bVal = b.candidate.totalExperienceYears || 0;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered.map((s) => ({
      candidate: {
        candidate_id: s.candidate.id,
        full_name: s.candidate.fullName,
        emails: s.candidate.emails,
        phones: s.candidate.phones,
        location: s.candidate.location || undefined,
        work_auth: s.candidate.workAuth || undefined,
        current_title: s.candidate.currentTitle || undefined,
        total_experience_years: s.candidate.totalExperienceYears || undefined,
        skills: s.candidate.skills as any,
        seniority: s.candidate.seniority as any,
        education: s.candidate.education as any,
        experience_summary: s.candidate.experienceSummary || undefined,
        sources: s.candidate.sources as any,
        created_at: s.candidate.createdAt.toISOString(),
        updated_at: s.candidate.updatedAt.toISOString()
      },
      fitSnapshot: {
        snapshot_id: s.id,
        job_id: s.jobId,
        candidate_id: s.candidateId,
        overall: s.overall,
        byCompetency: s.byCompetency as any,
        redFlags: s.redFlags,
        explainAtoms: s.explainAtoms,
        calibrationVersion: s.calibrationVersion,
        created_at: s.createdAt.toISOString()
      }
    }));
  }
}
