import {
	BeforeInsert,
	Column,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { hash, genSalt } from 'bcryptjs';
import { ArticleEntity } from '@app/articles/articles.entity';

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

	@OneToMany(() => ArticleEntity, (article) => article.author)
	articles: ArticleEntity[];

	@ManyToMany(() => ArticleEntity)
	@JoinTable()
	favorites: ArticleEntity[];
}
