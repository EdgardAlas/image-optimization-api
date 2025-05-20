import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HealhModule } from './features/health/healh.module';
import { ConfigModule } from '@nestjs/config';
import { envs } from 'src/env/envs';
import { LoggerMiddleware } from 'src/common/middlewares/logger.middleware';
import { OptimizerModule } from './features/optimizer/optimizer.module';
import { OptimizerController } from './features/optimizer.controller';

@Module({
	imports: [
		HealhModule,
		ConfigModule.forRoot({
			load: [envs],
		}),
		OptimizerModule,
	],
	controllers: [OptimizerController],
	providers: [],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*');
	}
}
