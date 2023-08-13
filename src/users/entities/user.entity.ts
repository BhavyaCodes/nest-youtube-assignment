import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({
    type: 'timestamptz',
  })
  entryCreatedAt: Date;
}
