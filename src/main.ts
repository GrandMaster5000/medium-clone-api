if (!process.env.IS_TS_NODE) {
	require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendValidationPipe } from './shared/pipes/backendValidation.pipe';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new BackendValidationPipe());
	await app.listen(3000);
}
bootstrap();
