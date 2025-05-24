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
	@UseInterceptors(
		FilesInterceptor('images', undefined, {
			limits: {
				files: 20,
				fileSize: 10 * 1024 * 1024, // 10 MB
			},
			fileFilter: (req, file, cb) => {
				if (file.mimetype.startsWith('image/')) {
					cb(null, true);
				} else {
					cb(new Error('Only image files are allowed!'), false);
				}
			},
		}),
	)
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				quality: {
					type: 'number',
					example: 80,
					default: 80,
					description: 'Compression quality for the output images (1-100).',
				},
				outputFormat: {
					type: 'string',
					enum: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif'],
					example: 'jpg',
					default: 'jpg',
					description: 'Desired output image format.',
				},
				preserveFileName: {
					type: 'boolean',
					example: false,
					default: false,
					description: 'Whether to preserve the original file name.',
				},
				maxWidth: {
					type: 'number',
					example: 800,
					description: 'Maximum width for resizing images.',
				},
				maxHeight: {
					type: 'number',
					example: 800,
					description: 'Maximum height for resizing images.',
				},
				resizeMode: {
					type: 'string',
					enum: ['contain', 'cover', 'fill', 'inset', 'outset', 'none'],
					example: 'contain',
					default: 'contain',
					description: 'Resize mode to use when resizing images.',
				},
				modifyDimensions: {
					type: 'boolean',
					example: false,
					default: false,
					description: 'Whether to modify image dimensions.',
				},
				removeMetadata: {
					type: 'boolean',
					example: false,
					default: false,
					description: 'Whether to remove metadata from images.',
				},
				images: {
					type: 'array',
					items: {
						type: 'string',
						format: 'binary',
					},
					description: 'Array of image files to be optimized.',
				},
			},
			required: ['images'],
		},
		description: 'Optimize images with various options.',
		examples: {
			default: {
				summary: 'Default Example',
				value: {
					quality: 80,
					outputFormat: 'jpg',
					preserveFileName: false,
					maxWidth: 800,
					maxHeight: 800,
					resizeMode: 'contain',
					modifyDimensions: false,
					removeMetadata: false,
					images: [],
				},
			},
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
