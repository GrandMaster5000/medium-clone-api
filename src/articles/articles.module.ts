import { FollowEntity } from '@app/profiles/follow.etntity';
import { UserEntity } from '@app/user/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticlesController } from './articles.controller';
import { ArticleEntity } from './articles.entity';
import { ArticlesService } from './articles.service';

@Module({
	imports: [TypeOrmModule.forFeature([ArticleEntity, UserEntity, FollowEntity])],
	controllers: [ArticlesController],
	providers: [ArticlesService],
})
export class ArticlesModule {}
