import { IExpressRequest } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}

	async use(req: IExpressRequest, res: Response, next: NextFunction): Promise<void> {
		if (!req.headers.authorization) {
			req.user = null;
			next();
			return;
		}
		const token = req.headers.authorization.split(' ')[1];

		try {
			const decode = verify(token, this.configService.get('JWT_SECRET'));
			const user = await this.userService.findById(decode.id);
			req.user = user;
			next();
		} catch (e) {
			req.user = null;
			next();
		}
	}
}
