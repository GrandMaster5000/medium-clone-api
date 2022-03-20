import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { IUserResponse } from './types/userResponse.interface';
import { LoginUserDto } from './dto/loginUser.dto';
import { compare } from 'bcryptjs';
import { EMAIL_ARE_TAKEN, INVALID_PASSWORD, USER_EMAIL_NOT_FOUND } from './user.constants';

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
			throw new UnprocessableEntityException(EMAIL_ARE_TAKEN);
		}
		const newUser = new UserEntity();
		Object.assign(newUser, user);
		return this.userRepository.save(newUser);
	}

	async loginUser(loginUser: LoginUserDto): Promise<UserEntity> {
		const user = await this.userRepository.findOne(
			{
				email: loginUser.email,
			},
			{ select: ['id', 'username', 'email', 'bio', 'image', 'password'] },
		);

		if (!user) {
			throw new UnauthorizedException(USER_EMAIL_NOT_FOUND);
		}
		const isComparePass = await compare(loginUser.password, user.password);

		if (!isComparePass) {
			throw new UnauthorizedException(INVALID_PASSWORD);
		}

		delete user.password;

		return user;
	}

	async findById(id: number): Promise<UserEntity> {
		return this.userRepository.findOne(id);
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
