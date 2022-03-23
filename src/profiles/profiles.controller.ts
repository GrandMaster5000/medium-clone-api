import { User } from '@app/user/decorators/user.decorator';
import { Controller, Get, Param } from '@nestjs/common';
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
}
