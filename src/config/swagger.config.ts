import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

/* 
  npm install @nestjs/swagger swagger-ui-express
  npm install swagger-themes
*/

export function swaggerSetup(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Shopping Cart API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
  });
}
