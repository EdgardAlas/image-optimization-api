import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { envs } from 'src/env/envs';
import { HealhModule } from './features/health/healh.module';
import { OptimizerModule } from './features/optimizer/optimizer.module';

@Module({
	imports: [
		HealhModule,
		ConfigModule.forRoot({
			load: [envs],
		}),
		OptimizerModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
