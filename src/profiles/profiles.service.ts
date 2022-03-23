import { UserEntity } from '@app/user/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PROFILE_DOES_NOT_EXIST } from './profiles.constants';
import { ProfileType } from './types/profile.type';
import { IProfileResponse } from './types/profileResponse.interface';

@Injectable()
export class ProfilesService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
	) {}

	async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ username: profileUsername });

		if (!user) {
			throw new NotFoundException(PROFILE_DOES_NOT_EXIST);
		}

		return { ...user, folowing: false };
	}

	buildProfileResponse(profile: ProfileType): IProfileResponse {
		delete profile.email;
		return { profile };
	}
}
