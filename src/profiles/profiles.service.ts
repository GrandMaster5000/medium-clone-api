import { UserEntity } from '@app/user/user.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowEntity } from './follow.etntity';
import { FOLLOWER_FOLLOWIND_CANT_EQUAL, PROFILE_DOES_NOT_EXIST } from './profiles.constants';
import { ProfileType } from './types/profile.type';
import { IProfileResponse } from './types/profileResponse.interface';

@Injectable()
export class ProfilesService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(FollowEntity) private readonly followRepository: Repository<FollowEntity>,
	) {}

	async getProfile(currentUserId: number, profileUsername: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ username: profileUsername });

		if (!user) {
			throw new NotFoundException(PROFILE_DOES_NOT_EXIST);
		}

		const follow = await this.followRepository.findOne({
			followerId: currentUserId,
			followingId: user.id,
		});

		return { ...user, folowing: Boolean(follow) };
	}

	async follow(currentUserId: number, profileUsername: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ username: profileUsername });

		if (!user) {
			throw new NotFoundException(PROFILE_DOES_NOT_EXIST);
		}

		if (currentUserId === user.id) {
			throw new BadRequestException(FOLLOWER_FOLLOWIND_CANT_EQUAL);
		}

		const follow = await this.followRepository.findOne({
			followerId: currentUserId,
			followingId: user.id,
		});

		if (!follow) {
			const followToCreate = new FollowEntity();
			followToCreate.followerId = currentUserId;
			followToCreate.followingId = user.id;
			await this.followRepository.save(followToCreate);
		}

		return { ...user, folowing: true };
	}

	async unFollow(currentUserId: number, profileUsername: string): Promise<ProfileType> {
		const user = await this.userRepository.findOne({ username: profileUsername });

		if (!user) {
			throw new NotFoundException(PROFILE_DOES_NOT_EXIST);
		}

		if (currentUserId === user.id) {
			throw new BadRequestException(FOLLOWER_FOLLOWIND_CANT_EQUAL);
		}

		await this.followRepository.delete({
			followerId: currentUserId,
			followingId: user.id,
		});

		return { ...user, folowing: false };
	}

	buildProfileResponse(profile: ProfileType): IProfileResponse {
		delete profile.email;
		return { profile };
	}
}
