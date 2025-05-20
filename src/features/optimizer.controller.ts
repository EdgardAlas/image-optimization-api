import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { OptimizeImagesRequestDto } from 'src/features/optimizer/dto/requests/optimize-images.request.dto';
import { OptimizeImagesResponseDto } from 'src/features/optimizer/dto/responses/optimize-images.response.dto';

@Controller('optimizer')
export class OptimizerController {
	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: OptimizeImagesResponseDto,
	})
	optimizeImages(
		@Body()
		optimizeImagesRequestDto: OptimizeImagesRequestDto,
	) {
		return optimizeImagesRequestDto;
	}
}
