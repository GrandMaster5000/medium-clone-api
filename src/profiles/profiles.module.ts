import { UserEntity } from '@app/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowEntity } from './follow.etntity';
import { ProfilesController } from './profiles.controller';
import { ProfilesService } from './profiles.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])],
	controllers: [ProfilesController],
	providers: [ProfilesService],
})
export class ProfilesModule {}
