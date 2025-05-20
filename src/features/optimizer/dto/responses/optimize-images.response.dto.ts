import { ApiProperty } from '@nestjs/swagger';

export class OptimizeImageResponse {
	@ApiProperty({ description: 'The name of the image file.' })
	fileName: string;

	@ApiProperty({ description: 'The original size (in bytes) of the image.' })
	originalSize: number;

	@ApiProperty({ description: 'The optimized size (in bytes) of the image.' })
	optimizedSize: number;

	@ApiProperty({
		description: 'The percentage reduction in size after optimization.',
	})
	reduction: number;

	@ApiProperty({ description: 'The optimized image as a base64 string.' })
	imageBase64: string;

	constructor(props: OptimizeImageResponse) {
		Object.assign(this, props);
	}
}

export class OptimizeImagesResponseDto {
	@ApiProperty({
		description: 'The total size (in bytes) of all images before optimization.',
	})
	originalSize: number;

	@ApiProperty({
		description: 'The total size (in bytes) of all images after optimization.',
	})
	optimizedSize: number;

	@ApiProperty({
		description: 'The percentage reduction in size after optimization.',
	})
	reduction: number;

	@ApiProperty({ description: 'The total number of images processed.' })
	totalImages: number;

	@ApiProperty({
		type: [OptimizeImageResponse],
		description: 'List of individual image optimization results.',
	})
	images: OptimizeImageResponse[];

	constructor(props: OptimizeImagesResponseDto) {
		Object.assign(this, props);
	}
}
