import { Controller, Get, Header } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  endpointProperties,
  endpointResponses,
} from 'src/common/utils/swagger-properties';

const properties = endpointProperties.monitoring;
const responses = endpointResponses;

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  @ApiOperation(properties.getMetrics)
  @ApiResponse(responses.internalServerError)
  public async getMetrics(): Promise<String> {
    return this.monitoringService.getMetrics();
  }
}
