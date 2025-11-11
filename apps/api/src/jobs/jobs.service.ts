import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import type { Job, JobCreate, JobUpdate, JobTemplateCreate } from '@candidate-screening/domain';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all jobs
   */
  async findAll(): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return jobs.map((job) => ({
      job_id: job.id,
      title: job.title,
      location: job.location || undefined,
      competencies: job.competencies as any,
      hardFilters: job.hardFilters as any,
      created_at: job.createdAt.toISOString(),
      updated_at: job.updatedAt.toISOString()
    }));
  }

  /**
   * Get a job by ID
   */
  async findOne(id: string): Promise<Job> {
    const job = await this.prisma.job.findUnique({
      where: { id }
    });

    if (!job) {
      throw new NotFoundException(`Job ${id} not found`);
    }

    return {
      job_id: job.id,
      title: job.title,
      location: job.location || undefined,
      competencies: job.competencies as any,
      hardFilters: job.hardFilters as any,
      created_at: job.createdAt.toISOString(),
      updated_at: job.updatedAt.toISOString()
    };
  }

  /**
   * Create a new job
   */
  async create(data: JobCreate): Promise<Job> {
    const job = await this.prisma.job.create({
      data: {
        id: uuidv4(),
        title: data.title,
        location: data.location,
        competencies: data.competencies as any,
        hardFilters: data.hardFilters as any
      }
    });

    return {
      job_id: job.id,
      title: job.title,
      location: job.location || undefined,
      competencies: job.competencies as any,
      hardFilters: job.hardFilters as any,
      created_at: job.createdAt.toISOString(),
      updated_at: job.updatedAt.toISOString()
    };
  }

  /**
   * Update a job
   */
  async update(id: string, data: JobUpdate): Promise<Job> {
    const job = await this.prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        location: data.location,
        competencies: data.competencies as any,
        hardFilters: data.hardFilters as any
      }
    });

    return {
      job_id: job.id,
      title: job.title,
      location: job.location || undefined,
      competencies: job.competencies as any,
      hardFilters: job.hardFilters as any,
      created_at: job.createdAt.toISOString(),
      updated_at: job.updatedAt.toISOString()
    };
  }

  /**
   * Delete a job
   */
  async delete(id: string): Promise<void> {
    await this.prisma.job.delete({
      where: { id }
    });
  }

  /**
   * Get job statistics
   */
  async getStats(id: string) {
    const [applicationsCount, candidatesCount, avgFit] = await Promise.all([
      this.prisma.application.count({ where: { jobId: id } }),
      this.prisma.fitSnapshot.count({ where: { jobId: id } }),
      this.prisma.fitSnapshot.aggregate({
        where: { jobId: id },
        _avg: { overall: true }
      })
    ]);

    return {
      applicationsCount,
      candidatesCount,
      avgFit: avgFit._avg.overall || 0
    };
  }

  /**
   * Create a job template
   */
  async createTemplate(data: JobTemplateCreate) {
    const template = await this.prisma.jobTemplate.create({
      data: {
        id: uuidv4(),
        name: data.name,
        competencies: data.competencies as any,
        hardFilters: data.hardFilters as any
      }
    });

    return {
      template_id: template.id,
      name: template.name,
      competencies: template.competencies as any,
      hardFilters: template.hardFilters as any,
      created_at: template.createdAt.toISOString()
    };
  }

  /**
   * Get all job templates
   */
  async getTemplates() {
    const templates = await this.prisma.jobTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return templates.map((t) => ({
      template_id: t.id,
      name: t.name,
      competencies: t.competencies as any,
      hardFilters: t.hardFilters as any,
      created_at: t.createdAt.toISOString()
    }));
  }

  /**
   * Apply a template to a job
   */
  async applyTemplate(jobId: string, templateId: string): Promise<Job> {
    const template = await this.prisma.jobTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      throw new NotFoundException(`Template ${templateId} not found`);
    }

    return this.update(jobId, {
      competencies: template.competencies as any,
      hardFilters: template.hardFilters as any
    });
  }
}
