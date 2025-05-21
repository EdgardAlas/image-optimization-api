import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import { BaseService } from 'src/common/base-service';
import { OptimizeImagesRequestDto } from '../dto/requests/optimize-images.request.dto';
import { OptimizeImagesResponseDto } from '../dto/responses/optimize-images.response.dto';

@Injectable()
export class OptimizeImagesService
	implements BaseService<OptimizeImagesResponseDto>
{
	async execute(
		request: OptimizeImagesRequestDto,
		files: Express.Multer.File[],
	) {
		const {
			modifyDimensions,
			maxWidth,
			maxHeight,
			resizeMode,
			removeMetadata,
			quality,
			outputFormat,
			preserveFileName,
		} = request;

		const originalSize = this.calculateTotalSize(files);

		const optimizedFiles = await Promise.all(
			files.map((file) =>
				this.processFile(file, {
					modifyDimensions,
					maxWidth,
					maxHeight,
					resizeMode,
					removeMetadata,
					quality,
					outputFormat,
					preserveFileName,
				}),
			),
		);

		const optimizedSize = this.calculateOptimizedTotalSize(optimizedFiles);

		const totalReduction = this.calculateReduction(originalSize, optimizedSize);

		return new OptimizeImagesResponseDto({
			originalSize,
			optimizedSize,
			reduction: totalReduction,
			totalImages: files.length,
			usedOptions: request,
			images: optimizedFiles,
		});
	}

	private async processFile(
		file: Express.Multer.File,
		options: OptimizeImagesRequestDto,
	) {
		const {
			modifyDimensions,
			maxWidth,
			maxHeight,
			resizeMode,
			removeMetadata,
			quality,
			outputFormat,
			preserveFileName,
		} = options;

		const image = sharp(file.buffer);

		if (modifyDimensions) {
			image.resize({
				width: maxWidth,
				height: maxHeight,
				fit: resizeMode as keyof sharp.FitEnum,
			});
		}

		if (!removeMetadata) {
			image.withMetadata();
		}

		if (outputFormat) {
			image.toFormat(outputFormat as keyof sharp.FormatEnum, {
				quality,
			});
		}

		const imageBuffer = await image.toBuffer();

		const optimizedSize = Buffer.byteLength(imageBuffer);
		const reduction = this.calculateReduction(file.size, optimizedSize);
		const imageBase64 = imageBuffer.toString('base64');
		const url = `data:image/${outputFormat};base64,${imageBase64}`;

		return {
			fileName: preserveFileName
				? file.originalname
				: `${crypto.randomUUID()}.jpg`,
			originalSize: file.size,
			optimizedSize,
			reduction,
			imageBase64: url,
		};
	}

	private calculateTotalSize(files: Express.Multer.File[]): number {
		return files.reduce((acc, file) => acc + file.size, 0);
	}

	private calculateOptimizedTotalSize(
		optimizedFiles: { optimizedSize: number }[],
	): number {
		return optimizedFiles.reduce((acc, file) => acc + file.optimizedSize, 0);
	}

	private calculateReduction(
		originalSize: number,
		optimizedSize: number,
	): number {
		if (originalSize === 0) return 0;
		return ((originalSize - optimizedSize) / originalSize) * 100;
	}
}
