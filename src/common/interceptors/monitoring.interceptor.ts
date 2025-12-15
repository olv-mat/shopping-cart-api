import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { MonitoringService } from 'src/modules/monitoring/monitoring.service';

// nest g itc monitoring common/interceptors

@Injectable()
export class MonitoringInterceptor implements NestInterceptor {
  constructor(private readonly monitoringService: MonitoringService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        const duration = (Date.now() - start) / 1000;
        this.monitoringService.recordRequestDuration(method, duration);
        this.monitoringService.incrementRequestCounter(method);
      }),
    );
  }
}
