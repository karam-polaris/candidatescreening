import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { Candidate } from '@candidate-screening/domain';

@Injectable()
export class CandidatesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all candidates with optional filters
   */
  async findAll(filters?: {
    skills?: string[];
    min_experience?: number;
    location?: string;
    work_auth?: string;
  }): Promise<Candidate[]> {
    const where: any = {};

    if (filters) {
      if (filters.min_experience !== undefined) {
        where.totalExperienceYears = { gte: filters.min_experience };
      }

      if (filters.location) {
        where.location = { contains: filters.location, mode: 'insensitive' };
      }

      if (filters.work_auth) {
        where.workAuth = filters.work_auth;
      }
    }

    const candidates = await this.prisma.candidate.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Filter by skills if provided (JSON field filtering)
    let filtered = candidates;
    if (filters?.skills && filters.skills.length > 0) {
      const skillsFilter = filters.skills;
      filtered = candidates.filter((candidate) => {
        const candidateSkills = (candidate.skills as any[]).map((s: any) =>
          s.name.toLowerCase()
        );
        return skillsFilter.some((skill) =>
          candidateSkills.includes(skill.toLowerCase())
        );
      });
    }

    return filtered.map((c) => this.mapToCandidate(c));
  }

  /**
   * Get a candidate by ID
   */
  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id }
    });

    if (!candidate) {
      throw new NotFoundException(`Candidate ${id} not found`);
    }

    return this.mapToCandidate(candidate);
  }

  /**
   * Get candidates for a specific job with their fit snapshots
   */
  async findForJob(
    jobId: string,
    filters?: {
      skills?: string[];
      min_experience?: number;
      location?: string;
      work_auth?: string;
      min_fit?: number;
      min_assessment_score?: number;
    }
  ) {
    // Get all fit snapshots for this job
    const snapshots = await this.prisma.fitSnapshot.findMany({
      where: { jobId },
      include: {
        candidate: true
      },
      orderBy: { overall: 'desc' }
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
        // Get assessments for candidates
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

    return filtered.map((s) => ({
      candidate: this.mapToCandidate(s.candidate),
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

  /**
   * Map Prisma candidate to domain Candidate
   */
  private mapToCandidate(c: any): Candidate {
    return {
      candidate_id: c.id,
      full_name: c.fullName,
      emails: c.emails,
      phones: c.phones,
      location: c.location || undefined,
      work_auth: c.workAuth || undefined,
      current_title: c.currentTitle || undefined,
      total_experience_years: c.totalExperienceYears || undefined,
      skills: c.skills as any,
      seniority: c.seniority || undefined,
      education: c.education as any,
      experience_summary: c.experienceSummary || undefined,
      sources: c.sources as any,
      created_at: c.createdAt.toISOString(),
      updated_at: c.updatedAt.toISOString()
    };
  }
}
