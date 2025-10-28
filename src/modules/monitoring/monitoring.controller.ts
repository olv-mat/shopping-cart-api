import { Controller, Get, Header } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  public async getMetrics(): Promise<String> {
    return this.monitoringService.getMetrics();
  }
}
