import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { MonitoringInterceptor } from './common/interceptors/monitoring.interceptor';
import { swaggerSetup } from './config/swagger.config';
import { MonitoringService } from './modules/monitoring/monitoring.service';

/*
  npx @nestjs/cli new <project>
  cd <project>
*/

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerSetup(app);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // Enable Global Request Monitoring Interceptor For Metrics Collection
  app.useGlobalInterceptors(
    new MonitoringInterceptor(app.get(MonitoringService)),
  );
  // Enable NestJS Dependency Injection Inside 'class-validator' Constraints
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
