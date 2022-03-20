import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { IUserResponse } from './types/userResponse.interface';
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
}
