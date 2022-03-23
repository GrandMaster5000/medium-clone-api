import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { IProfileResponse } from './types/profileResponse.interface';

@Controller('profiles')
export class ProfilesController {
	constructor(private readonly profileService: ProfilesService) {}

	@Get(':username')
	async getProfile(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.getProfile(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}

	@Post(':username/follow')
	@UseGuards(AuthGuard)
	async follow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.follow(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}

	@Delete(':username/follow')
	@UseGuards(AuthGuard)
	async unFollow(
		@User('id') currentUserId: number,
		@Param('username') profileUsername: string,
	): Promise<IProfileResponse> {
		const profile = await this.profileService.unFollow(currentUserId, profileUsername);
		return this.profileService.buildProfileResponse(profile);
	}
}
