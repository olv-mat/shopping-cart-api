import { Injectable } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Gauge, Registry } from 'prom-client';

@Injectable()
export class MonitoringService {
  private readonly registry: Registry;
  private readonly requestCounter: Counter<string>;
  private readonly durationGauge: Gauge<string>;

  constructor() {
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });

    this.requestCounter = new Counter({
      name: 'total_requests',
      help: 'Total number of requests',
      labelNames: ['method'],
    });

    this.durationGauge = new Gauge({
      name: 'average_request_duration',
      help: 'Average request duration in seconds',
      labelNames: ['method'],
    });

    this.registry.registerMetric(this.requestCounter);
    this.registry.registerMetric(this.durationGauge);
  }

  public incrementRequestCounter(method: string) {
    this.requestCounter.inc({ method });
  }

  public recordRequestDuration(method: string, duration: number) {
    this.durationGauge.set({ method }, duration);
  }

  public async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }
}
