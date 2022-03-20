import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './guards/auth.guard';
import { UserController } from './user.controller';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity]), ConfigModule],
	controllers: [UserController],
	providers: [UserService, AuthGuard],
	exports: [UserService],
})
export class UserModule {}
