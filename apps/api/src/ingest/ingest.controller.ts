import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('api/ingest')
export class IngestController {
  constructor(private ingestService: IngestService) {}

  @Post('candidates')
  async ingestCandidates(@Body() body: { content: string; format?: 'jsonl' | 'json' }) {
    try {
      const result = await this.ingestService.ingestCandidates(body.content, body.format || 'jsonl');
      return {
        success: true,
        message: `Ingested ${result.count} candidates`,
        ...result
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('applications')
  async ingestApplications(@Body() body: { content: string }) {
    try {
      const result = await this.ingestService.ingestApplications(body.content);
      return {
        success: true,
        message: `Ingested ${result.count} applications`,
        ...result
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('profiles')
  async ingestProfiles(@Body() body: { content: string; format: 'csv' | 'jsonl' }) {
    try {
      const result = await this.ingestService.ingestProfiles(body.content, body.format);
      return {
        success: true,
        message: `Ingested ${result.count} profiles`,
        ...result
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('assessments')
  async ingestAssessments(@Body() body: { content: string; format: 'csv' | 'jsonl' }) {
    try {
      const result = await this.ingestService.ingestAssessments(body.content, body.format);
      return {
        success: true,
        message: `Ingested ${result.count} assessments`,
        ...result
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
