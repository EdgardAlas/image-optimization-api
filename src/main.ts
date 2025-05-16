import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const logger = new Logger('Bootstrap');
	const port = process.env.PORT || 3000;

	app.use(json({ limit: '10mb' }));
	app.use(urlencoded({ limit: '10mb', extended: true }));

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
		}),
	);

	app.enableCors({
		origin: process.env.CORS_ORIGIN?.split(','),
	});

	const config = new DocumentBuilder()
		.setTitle('Smart Image Optimization API')
		.setDescription(
			'RESTful API for optimizing, compressing, and transforming images efficiently for web and mobile applications.',
		)
		.build();

	const documentFactory = () => SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, documentFactory);

	await app.listen(port);
	logger.log(`Application is running on: http://localhost:${port}`);
}

void bootstrap();
