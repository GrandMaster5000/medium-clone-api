import { IExpressRequest } from '@app/types/expressRequest.interface';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { NOT_AUTHORIZED } from '../user.constants';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const request = context.switchToHttp().getRequest<IExpressRequest>();

		if (request.user) {
			return true;
		}

		throw new UnauthorizedException(NOT_AUTHORIZED);
	}
}
