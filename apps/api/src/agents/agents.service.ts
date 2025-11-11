import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import { JobsService } from '../jobs/jobs.service';
import { CandidatesService } from '../candidates/candidates.service';
import { AzureOpenAI } from 'openai';
import type { ChatMessage } from '@candidate-screening/domain';

interface FunctionCall {
  name: string;
  arguments: string;
}

@Injectable()
export class AgentsService {
  private openai: AzureOpenAI | null = null;

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private scoringService: ScoringService,
    private jobsService: JobsService,
    private candidatesService: CandidatesService
  ) {
    // Initialize Azure OpenAI if credentials are available
    const apiKey = this.configService.get<string>('AZURE_OPENAI_API_KEY');
    const endpoint = this.configService.get<string>('AZURE_OPENAI_ENDPOINT');

    if (apiKey && endpoint) {
      this.openai = new AzureOpenAI({
        apiKey,
        endpoint,
        apiVersion: this.configService.get<string>('AZURE_OPENAI_API_VERSION') || '2024-02-15-preview'
      });
    }
  }

  /**
   * Function definitions for OpenAI function calling
   */
  private getFunctionDefinitions() {
    return [
      {
        name: 'compareCandidates',
        description: 'Compare multiple candidates for a job position, showing their relative strengths and weaknesses',
        parameters: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              description: 'The ID of the job position'
            },
            candidateIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of candidate IDs to compare'
            }
          },
          required: ['jobId', 'candidateIds']
        }
      },
      {
        name: 'explainScore',
        description: 'Explain the fit score for a specific candidate and job, with detailed reasoning',
        parameters: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              description: 'The ID of the job position'
            },
            candidateId: {
              type: 'string',
              description: 'The ID of the candidate'
            },
            detail: {
              type: 'string',
              description: 'Optional: specific aspect to explain (e.g., "technical skills", "experience")'
            }
          },
          required: ['jobId', 'candidateId']
        }
      },
      {
        name: 'whatIfCalibration',
        description: 'Simulate what would happen if job requirements or weights were changed',
        parameters: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              description: 'The ID of the job position'
            },
            delta: {
              type: 'object',
              description: 'Changes to apply (weights, mustHaves, filters)',
              properties: {
                weights: {
                  type: 'object',
                  description: 'Competency name to new weight mapping'
                },
                mustHaves: {
                  type: 'object',
                  description: 'Competency name to boolean mapping'
                },
                filters: {
                  type: 'object',
                  description: 'Hard filters to change'
                }
              }
            }
          },
          required: ['jobId', 'delta']
        }
      },
      {
        name: 'filterCandidates',
        description: 'Filter and search candidates based on specific criteria',
        parameters: {
          type: 'object',
          properties: {
            jobId: {
              type: 'string',
              description: 'The ID of the job position'
            },
            filters: {
              type: 'object',
              properties: {
                skills: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Required skills'
                },
                min_experience: {
                  type: 'number',
                  description: 'Minimum years of experience'
                },
                location: {
                  type: 'string',
                  description: 'Location requirement'
                },
                work_auth: {
                  type: 'string',
                  description: 'Work authorization requirement'
                },
                min_assessment_score: {
                  type: 'number',
                  description: 'Minimum assessment score (0-100)'
                }
              }
            }
          },
          required: ['jobId', 'filters']
        }
      }
    ];
  }

  /**
   * Execute a function call
   */
  private async executeFunction(functionCall: FunctionCall): Promise<any> {
    const args = JSON.parse(functionCall.arguments);

    switch (functionCall.name) {
      case 'compareCandidates':
        return this.compareCandidates(args.jobId, args.candidateIds);

      case 'explainScore':
        return this.explainScore(args.jobId, args.candidateId, args.detail);

      case 'whatIfCalibration':
        return this.whatIfCalibration(args.jobId, args.delta);

      case 'filterCandidates':
        return this.filterCandidates(args.jobId, args.filters);

      default:
        throw new Error(`Unknown function: ${functionCall.name}`);
    }
  }

  /**
   * Compare candidates tool
   */
  async compareCandidates(jobId: string, candidateIds: string[]) {
    const job = await this.jobsService.findOne(jobId);

    const snapshots = await this.prisma.fitSnapshot.findMany({
      where: {
        jobId,
        candidateId: { in: candidateIds }
      },
      include: { candidate: true }
    });

    if (snapshots.length === 0) {
      return { error: 'No candidates found with scores for this job' };
    }

    const comparison = {
      job: job.title,
      candidates: snapshots.map((s) => ({
        name: s.candidate.fullName,
        candidate_id: s.candidateId,
        overall_fit: (s.overall * 100).toFixed(1) + '%',
        competencies: s.byCompetency,
        red_flags: s.redFlags,
        experience_years: s.candidate.totalExperienceYears,
        seniority: s.candidate.seniority,
        location: s.candidate.location
      }))
    };

    return comparison;
  }

  /**
   * Explain score tool
   */
  async explainScore(jobId: string, candidateId: string, detail?: string) {
    const snapshot = await this.prisma.fitSnapshot.findFirst({
      where: { jobId, candidateId },
      include: { candidate: true, job: true }
    });

    if (!snapshot) {
      return { error: 'No score found for this candidate and job' };
    }

    const explanation = {
      candidate: snapshot.candidate.fullName,
      job: snapshot.job.title,
      overall_fit: (snapshot.overall * 100).toFixed(1) + '%',
      explanation_atoms: snapshot.explainAtoms,
      competency_scores: snapshot.byCompetency,
      red_flags: snapshot.redFlags,
      candidate_details: {
        skills: snapshot.candidate.skills,
        experience_years: snapshot.candidate.totalExperienceYears,
        seniority: snapshot.candidate.seniority,
        current_title: snapshot.candidate.currentTitle
      }
    };

    return explanation;
  }

  /**
   * What-if calibration tool
   */
  async whatIfCalibration(jobId: string, delta: any) {
    const job = await this.jobsService.findOne(jobId);

    // Create a modified job configuration
    const modifiedJob = { ...job };

    if (delta.weights) {
      modifiedJob.competencies = modifiedJob.competencies.map((comp) => ({
        ...comp,
        weight: delta.weights[comp.name] !== undefined ? delta.weights[comp.name] : comp.weight
      }));
    }

    if (delta.mustHaves) {
      modifiedJob.competencies = modifiedJob.competencies.map((comp) => ({
        ...comp,
        mustHave: delta.mustHaves[comp.name] !== undefined ? delta.mustHaves[comp.name] : comp.mustHave
      }));
    }

    if (delta.filters) {
      modifiedJob.hardFilters = { ...modifiedJob.hardFilters, ...delta.filters };
    }

    // Get current top candidates
    const currentSnapshots = await this.prisma.fitSnapshot.findMany({
      where: { jobId },
      include: { candidate: true },
      orderBy: { overall: 'desc' },
      take: 10
    });

    return {
      message: 'Calibration simulation (note: actual scoring would need to be re-run)',
      original_job: job,
      modified_job: modifiedJob,
      current_top_candidates: currentSnapshots.map((s) => ({
        name: s.candidate.fullName,
        current_score: (s.overall * 100).toFixed(1) + '%'
      })),
      note: 'Run POST /api/score/:jobId/batch after updating the job to see actual new scores'
    };
  }

  /**
   * Filter candidates tool
   */
  async filterCandidates(jobId: string, filters: any) {
    const results = await this.scoringService.getScoredCandidates(jobId, filters);

    return {
      filters_applied: filters,
      results_count: results.length,
      candidates: results.slice(0, 20).map((r) => ({
        name: r.candidate.full_name,
        candidate_id: r.candidate_id,
        fit_score: (r.overall * 100).toFixed(1) + '%',
        experience_years: r.candidate.total_experience_years,
        skills: r.candidate.skills.map((s: any) => s.name),
        location: r.candidate.location,
        red_flags: r.redFlags
      }))
    };
  }

  /**
   * Chat with the copilot
   */
  async chat(messages: ChatMessage[]) {
    if (!this.openai) {
      // Fallback when OpenAI is not configured
      return {
        role: 'assistant',
        content: 'Azure OpenAI is not configured. Please set AZURE_OPENAI_API_KEY and AZURE_OPENAI_ENDPOINT environment variables to enable the chat copilot.'
      };
    }

    try {
      const deploymentName = this.configService.get<string>('AZURE_OPENAI_DEPLOYMENT_NAME') || 'gpt-4o-mini';

      const response = await this.openai.chat.completions.create({
        model: deploymentName,
        messages: messages as any,
        functions: this.getFunctionDefinitions() as any,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1000
      });

      const message = response.choices[0].message;

      // Check if the model wants to call a function
      if (message.function_call) {
        const functionResult = await this.executeFunction(message.function_call as any);

        // Call the model again with the function result
        const secondResponse = await this.openai.chat.completions.create({
          model: deploymentName,
          messages: [
            ...messages,
            message,
            {
              role: 'function',
              name: message.function_call.name,
              content: JSON.stringify(functionResult)
            }
          ] as any,
          temperature: 0.7,
          max_tokens: 1000
        });

        return {
          role: 'assistant',
          content: secondResponse.choices[0].message.content,
          function_call: message.function_call.name,
          function_result: functionResult
        };
      }

      return {
        role: 'assistant',
        content: message.content
      };
    } catch (error) {
      console.error('OpenAI error:', error);
      return {
        role: 'assistant',
        content: `Error: ${error.message}`
      };
    }
  }
}
