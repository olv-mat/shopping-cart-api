import { Controller, Get, Header } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation({ summary: 'Retrieve application monitoring metrics' })
  public async getMetrics(): Promise<String> {
    return this.monitoringService.getMetrics();
  }
}
