import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';

// npm install prom-client @willsoto/nestjs-prometheus

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
