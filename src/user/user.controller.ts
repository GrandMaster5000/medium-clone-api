import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from './guards/auth.guard';
import { IUserResponse } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@UseGuards(AuthGuard)
	async getUser(@User() user: UserEntity): Promise<IUserResponse> {
		return this.userService.buildUserResponse(user);
	}

	@Post('sign-up')
	async signUp(@Body('user') createUser: CreateUserDto): Promise<IUserResponse> {
		const user = await this.userService.createUser(createUser);
		return this.userService.buildUserResponse(user);
	}

	@Post('sign-in')
	async signIn(@Body('user') loginUser: LoginUserDto): Promise<IUserResponse> {
		const user = await this.userService.loginUser(loginUser);
		return this.userService.buildUserResponse(user);
	}

	@Put('updateUser')
	@UseGuards(AuthGuard)
	async updateUser(
		@User('id') currentUserId: number,
		@Body('user') updateUser: UpdateUserDto,
	): Promise<IUserResponse> {
		const user = await this.userService.updateUser(currentUserId, updateUser);
		return this.userService.buildUserResponse(user);
	}
}
