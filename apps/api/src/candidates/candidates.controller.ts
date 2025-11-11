import { Controller, Get, Param, Query } from '@nestjs/common';
import { CandidatesService } from './candidates.service';

@Controller('api/candidates')
export class CandidatesController {
  constructor(private candidatesService: CandidatesService) {}

  @Get()
  async findAll(
    @Query('skills') skills?: string,
    @Query('min_experience') minExperience?: string,
    @Query('location') location?: string,
    @Query('work_auth') workAuth?: string
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

    return this.candidatesService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }
}
