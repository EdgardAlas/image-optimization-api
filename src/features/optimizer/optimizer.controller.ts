import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { OptimizeImagesRequestDto } from 'src/features/optimizer/dto/requests/optimize-images.request.dto';
import { OptimizeImagesResponseDto } from 'src/features/optimizer/dto/responses/optimize-images.response.dto';
import { OptimizeImagesService } from 'src/features/optimizer/services/optimize-images.service';

@Controller('optimizer')
export class OptimizerController {
	constructor(private readonly optimizeImagesService: OptimizeImagesService) {}

	@Post()
	@ApiConsumes('multipart/form-data')
	@HttpCode(HttpStatus.OK)
	@ApiResponse({
		type: OptimizeImagesResponseDto,
	})
	@UseInterceptors(FilesInterceptor('images'))
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				// DTO properties
				quality: { type: 'number', example: 80, default: 80 },
				outputFormat: {
					type: 'string',
					enum: ['jpeg', 'png', 'webp', 'avif', 'gif'],
					example: 'jpeg',
					default: 'jpeg',
				},
				preserveFileName: { type: 'boolean', example: false, default: false },
				maxWidth: { type: 'number', example: 800 },
				maxHeight: { type: 'number', example: 800 },
				resizeMode: {
					type: 'string',
					enum: ['contain', 'cover', 'fill', 'inset', 'outset', 'none'],
					example: 'contain',
					default: 'contain',
				},
				modifyDimensions: { type: 'boolean', example: false, default: false },
				removeMetadata: { type: 'boolean', example: false, default: false },
				// File upload
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
				},
			},
			required: ['images'],
		},
	})
	optimizeImages(
		@Body()
		optimizeImagesRequestDto: OptimizeImagesRequestDto,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		return this.optimizeImagesService.execute(optimizeImagesRequestDto, images);
	}
}
