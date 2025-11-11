import { Module } from '@nestjs/common';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';
import { ScoringModule } from '../scoring/scoring.module';
import { JobsModule } from '../jobs/jobs.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [ScoringModule, JobsModule, CandidatesModule],
  controllers: [AgentsController],
  providers: [AgentsService],
  exports: [AgentsService]
})
export class AgentsModule {}
