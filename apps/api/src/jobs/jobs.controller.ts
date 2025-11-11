import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobCreateSchema, JobUpdateSchema, JobTemplateCreateSchema } from '@candidate-screening/domain';

@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  async findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @Get(':id/stats')
  async getStats(@Param('id') id: string) {
    return this.jobsService.getStats(id);
  }

  @Post()
  async create(@Body() body: any) {
    try {
      const validated = JobCreateSchema.parse(body);
      return this.jobsService.create(validated);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    try {
      const validated = JobUpdateSchema.parse(body);
      return this.jobsService.update(id, validated);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.jobsService.delete(id);
    return { success: true };
  }

  @Post('templates')
  async createTemplate(@Body() body: any) {
    try {
      const validated = JobTemplateCreateSchema.parse(body);
      return this.jobsService.createTemplate(validated);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('templates/all')
  async getTemplates() {
    return this.jobsService.getTemplates();
  }

  @Post(':id/apply-template/:templateId')
  async applyTemplate(@Param('id') id: string, @Param('templateId') templateId: string) {
    return this.jobsService.applyTemplate(id, templateId);
  }
}
