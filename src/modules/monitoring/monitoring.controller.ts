import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SwaggerInternalServerError } from 'src/common/swagger/responses.swagger';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Retrieve application monitoring metrics' })
  @SwaggerInternalServerError()
  public async getMetrics(): Promise<String> {
    return this.monitoringService.getMetrics();
  }
}
