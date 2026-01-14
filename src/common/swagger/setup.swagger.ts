import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

/* 
  npm install @nestjs/swagger swagger-ui-express
  npm install swagger-themes
*/

export function swaggerSetup(app: INestApplication): void {
  const builder = new DocumentBuilder()
    .setTitle('Shopping Cart API')
    .setDescription(
      `A NestJS-based API designed to manage a complete shopping cart system. 
      It includes modules for users, categories, products, orders, and carts, 
      featuring JWT authentication and RBAC.`.trim(),
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, builder);
  const theme = new SwaggerTheme();
  SwaggerModule.setup('api', app, document, {
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK),
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}
