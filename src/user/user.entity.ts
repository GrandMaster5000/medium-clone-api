import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash, genSalt } from 'bcryptjs';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column({ default: '' })
	username: string;

	@Column({ default: '' })
	bio: string;

	@Column({ default: '' })
	image: string;

	@Column({ select: false })
	password: string;

	@BeforeInsert()
	async hashPassword(): Promise<void> {
		const salt = await genSalt(10);
		this.password = await hash(this.password, +salt);
	}
}
