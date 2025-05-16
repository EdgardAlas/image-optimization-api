import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
	@ApiProperty({
		description: 'The status of the API',
		example: 'The API is up and running!',
	})
	public message?: string;

	constructor(message: string = 'The API is up and running!') {
		this.message = message;
	}
}
