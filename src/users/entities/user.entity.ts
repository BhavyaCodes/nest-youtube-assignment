import { Video } from 'src/videos/entities/video.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true, length: 1000 })
  email: string;

  @Column({ nullable: false, length: 200 })
  password: string;

  @ManyToMany(() => Video)
  @JoinTable()
  watchLater: Video[];

  @CreateDateColumn({
    type: 'timestamptz',
  })
  entryCreatedAt: Date;
}
