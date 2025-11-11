import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { IngestModule } from './ingest/ingest.module';
import { JobsModule } from './jobs/jobs.module';
import { CandidatesModule } from './candidates/candidates.module';
import { ScoringModule } from './scoring/scoring.module';
import { AgentsModule } from './agents/agents.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    IngestModule,
    JobsModule,
    CandidatesModule,
    ScoringModule,
    AgentsModule
  ]
})
export class AppModule {}
