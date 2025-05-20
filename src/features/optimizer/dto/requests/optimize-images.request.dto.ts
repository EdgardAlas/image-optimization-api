import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsString,
	Max,
	Min,
	ValidateIf,
} from 'class-validator';

function ToBoolean() {
	return Transform(({ value }) => {
		if (typeof value === 'boolean') return value;
		if (typeof value === 'string') return value.toLowerCase() === 'true';
		return Boolean(value);
	});
}

export class OptimizeImagesRequestDto {
	@ApiPropertyOptional({
		type: 'number',
		description: 'Quality of the image (1-100)',
		example: 80,
		default: 80,
	})
	@Type(() => Number)
	@IsNumber()
	@Min(0, { message: 'Quality must be at least 0' })
	@Max(100, { message: 'Quality must be at most 100' })
	quality: number = 80;

	@ApiPropertyOptional({
		type: 'string',
		description: 'Output format of the image',
		example: 'jpeg',
		enum: ['jpeg', 'png', 'webp', 'avif', 'gif'],
		default: 'jpeg',
	})
	@IsString()
	@IsEnum(['jpeg', 'png', 'webp', 'avif', 'gif'], {
		message: 'Output format must be one of: jpeg, png, webp, avif, gif',
	})
	outputFormat: string = 'jpeg';

	@ApiPropertyOptional({
		type: 'boolean',
		description: 'Whether to preserve the original file name',
		example: true,
		default: false,
	})
	@ToBoolean()
	@IsBoolean()
	preserveFileName: boolean = false;

	@ApiPropertyOptional({
		type: 'number',
		description:
			'Maximum width of the image (required if modifyDimensions is true)',
		example: 800,
	})
	@ValidateIf((o: OptimizeImagesRequestDto) => o.modifyDimensions, {
		message: 'Max width must be provided if modifyDimensions is true',
	})
	@Type(() => Number)
	@IsNumber()
	@Min(1, { message: 'Max width must be at least 1' })
	@Max(10000, { message: 'Max width must be at most 10000' })
	maxWidth?: number;

	@ApiPropertyOptional({
		type: 'number',
		description:
			'Maximum height of the image (required if modifyDimensions is true)',
		example: 800,
	})
	@ValidateIf((o: OptimizeImagesRequestDto) => o.modifyDimensions, {
		message: 'Max height must be provided if modifyDimensions is true',
	})
	@Type(() => Number)
	@IsNumber()
	@Min(1, { message: 'Max height must be at least 1' })
	@Max(10000, { message: 'Max height must be at most 10000' })
	maxHeight?: number;

	@ApiPropertyOptional({
		type: 'string',
		description: 'Resize mode of the image',
		example: 'contain',
		enum: ['contain', 'cover', 'fill', 'inset', 'outset', 'none'],
		default: 'contain',
	})
	@ValidateIf((o: OptimizeImagesRequestDto) => o.modifyDimensions, {
		message: 'Resize mode must be provided if modifyDimensions is true',
	})
	@IsString()
	@IsEnum(['contain', 'cover', 'fill', 'inset', 'outset', 'none'], {
		message:
			'Resize mode must be one of: contain, cover, fill, inset, outset, none',
	})
	resizeMode: string = 'contain';

	@ApiPropertyOptional({
		type: 'boolean',
		description: 'Whether to modify the dimensions of the image',
		example: true,
		default: false,
	})
	@ToBoolean()
	@IsBoolean()
	modifyDimensions: boolean = false;

	@ApiPropertyOptional({
		type: 'boolean',
		description: 'Remove EXIF metadata from the image',
		example: true,
		default: false,
	})
	@ToBoolean()
	@IsBoolean()
	removeMetadata?: boolean = false;
}
