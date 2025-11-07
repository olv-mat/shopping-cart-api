import { Controller, Get, Header } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiOperation } from '@nestjs/swagger';
import { endpointProperties } from 'src/common/utils/swagger-properties';

const properties = endpointProperties.monitoring;

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation(properties.getMetrics)
  public async getMetrics(): Promise<String> {
    return this.monitoringService.getMetrics();
  }
}
