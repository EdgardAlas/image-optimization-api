import { Module } from '@nestjs/common';
import { HealhController } from 'src/features/health/healh.controller';
import { HealthCheckService } from './services/health-check.service';

@Module({
  controllers: [HealhController],
  providers: [HealthCheckService],
})
export class HealhModule {}
