import {
	ArgumentMetadata,
	PipeTransform,
	UnprocessableEntityException,
	ValidationError,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

export class BackendValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata): Promise<void> {
		const object = plainToClass(metadata.metatype, value);
		const errors = await validate(object);

		if (errors.length === 0) {
			return value;
		}

		throw new UnprocessableEntityException({
			errors: this.formatErrors(errors),
		});
	}

	private formatErrors(errors: ValidationError[]): Record<string, string[]> {
		return errors.reduce((acc, err) => {
			acc[err.property] = Object.values(err.constraints);
			return acc;
		}, {});
	}
}
