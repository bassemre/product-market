import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('kortobaa Api')
    .setDescription(
      'This API provide the needed services to implement kortobaa',
    )
    .setVersion('3.0.0')
    .addBearerAuth()
    .addTag('auth')
    .addTag('products')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);
}
