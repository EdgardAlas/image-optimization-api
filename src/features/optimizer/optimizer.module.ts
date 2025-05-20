import { Module } from '@nestjs/common';
import { OptimizeImagesService } from './services/optimize-images.service';
import { OptimizerController } from 'src/features/optimizer/optimizer.controller';

@Module({
	providers: [OptimizeImagesService],
	controllers: [OptimizerController],
})
export class OptimizerModule {}
