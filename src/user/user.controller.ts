import { IExpressRequest } from '@app/types/expressRequest.interface';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Post('sign-up')
	async signUp(@Body('user') createUser: CreateUserDto): Promise<IUserResponse> {
		const user = await this.userService.createUser(createUser);
		return this.userService.buildUserResponse(user);
	}

	@UsePipes(new ValidationPipe())
	@Post('sign-in')
	async signIn(@Body('user') loginUser: LoginUserDto): Promise<IUserResponse> {
		const user = await this.userService.loginUser(loginUser);
		return this.userService.buildUserResponse(user);
	}

	@Get()
	async getUser(@User() user: UserEntity): Promise<IUserResponse> {
		return this.userService.buildUserResponse(user);
	}
}
