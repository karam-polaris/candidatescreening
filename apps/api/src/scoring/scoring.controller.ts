import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { CandidatesService } from '../candidates/candidates.service';

@Controller('api')
export class ScoringController {
  constructor(
    private scoringService: ScoringService,
    private candidatesService: CandidatesService
  ) {}

  @Post('score/:jobId/batch')
  async scoreBatch(
    @Param('jobId') jobId: string,
    @Body() body: { calibrationVersion?: string }
  ) {
    return this.scoringService.scoreBatch(jobId, body.calibrationVersion);
  }

  @Get('jobs/:jobId/candidates')
  async getCandidatesForJob(
    @Param('jobId') jobId: string,
    @Query('skills') skills?: string,
    @Query('min_experience') minExperience?: string,
    @Query('location') location?: string,
    @Query('work_auth') workAuth?: string,
    @Query('min_fit') minFit?: string,
    @Query('min_assessment_score') minAssessmentScore?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc'
  ) {
    const filters: any = {};

    if (skills) {
      filters.skills = skills.split(',');
    }

    if (minExperience) {
      filters.min_experience = parseFloat(minExperience);
    }

    if (location) {
      filters.location = location;
    }

    if (workAuth) {
      filters.work_auth = workAuth;
    }

    if (minFit) {
      filters.min_fit = parseFloat(minFit);
    }

    if (minAssessmentScore) {
      filters.min_assessment_score = parseFloat(minAssessmentScore);
    }

    return this.scoringService.getScoredCandidates(jobId, filters, sort, order);
  }
}
