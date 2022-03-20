import { HttpException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IUserResponse } from './types/userResponse.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		private readonly configService: ConfigService,
	) {}

	async createUser(user: CreateUserDto): Promise<UserEntity> {
		const userByEmail = await this.userRepository.findOne({
			email: user.email,
		});
		const userByUsername = await this.userRepository.findOne({
			username: user.username,
		});
		if (userByEmail || userByUsername) {
			throw new UnprocessableEntityException('Email or username are taken');
		}
		const newUser = new UserEntity();
		Object.assign(newUser, user);
		return this.userRepository.save(newUser);
	}

	generateJwt(user: UserEntity): string {
		return sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			this.configService.get('JWT_SECRET'),
		);
	}

	buildUserResponse(user: UserEntity): IUserResponse {
		return {
			user: {
				...user,
				token: this.generateJwt(user),
			},
		};
	}
}
