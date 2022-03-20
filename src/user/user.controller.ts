import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { IUserResponse } from './types/userResponse.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@UsePipes(new ValidationPipe())
	@Post('registration')
	async createUser(@Body('user') createUser: CreateUserDto): Promise<IUserResponse> {
		const user = await this.userService.createUser(createUser);
		return this.userService.buildUserResponse(user);
	}
}
