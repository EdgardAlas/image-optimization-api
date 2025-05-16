import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { HealthCheckResponseDto } from 'src/features/health/dto/responses/health-check.response.dto';
import { HealthCheckService } from 'src/features/health/services/health-check.service';

@Controller('health')
export class HealhController {
	constructor(private readonly healthCheckService: HealthCheckService) {}

	@ApiResponse({
		type: HealthCheckResponseDto,
		status: HttpStatus.OK,
	})
	@Get()
	healthCheck() {
		return this.healthCheckService.execute();
	}
}
