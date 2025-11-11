import { Controller, Post, Body } from '@nestjs/common';
import { AgentsService } from './agents.service';

@Controller('api/agents')
export class AgentsController {
  constructor(private agentsService: AgentsService) {}

  @Post('compare')
  async compareCandidates(@Body() body: { jobId: string; candidateIds: string[] }) {
    return this.agentsService.compareCandidates(body.jobId, body.candidateIds);
  }

  @Post('explain')
  async explainScore(@Body() body: { jobId: string; candidateId: string; detail?: string }) {
    return this.agentsService.explainScore(body.jobId, body.candidateId, body.detail);
  }

  @Post('whatif')
  async whatIfCalibration(@Body() body: { jobId: string; delta: any }) {
    return this.agentsService.whatIfCalibration(body.jobId, body.delta);
  }

  @Post('filter')
  async filterCandidates(@Body() body: { jobId: string; filters: any }) {
    return this.agentsService.filterCandidates(body.jobId, body.filters);
  }

  @Post('chat')
  async chat(@Body() body: { messages: any[] }) {
    return this.agentsService.chat(body.messages);
  }
}
