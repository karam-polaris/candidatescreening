import { Module } from '@nestjs/common';
import { ScoringController } from './scoring.controller';
import { ScoringService } from './scoring.service';
import { JobsModule } from '../jobs/jobs.module';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  imports: [JobsModule, CandidatesModule],
  controllers: [ScoringController],
  providers: [ScoringService],
  exports: [ScoringService]
})
export class ScoringModule {}
