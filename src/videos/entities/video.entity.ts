import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  @Index({ unique: true })
  youtubeVideoId: string;

  @Column({ length: 500, nullable: false })
  title: string;

  @Column({ length: 10000, nullable: true })
  description?: string;

  @Column({ length: 300, nullable: false })
  thumbnailUrl: string;

  @Column({ length: 300, nullable: false })
  videoUrl: string;

  @Column({ type: 'timestamptz' })
  publishedAt: Date;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  entryCreatedAt: Date;

  @AfterInsert()
  logInsert() {
    console.log('Inserted video with id', this.id);
  }
}

// Define an entity (e.g., "Video") to store video details
//(e.g., "id", "title", "description", "publishedAt", "thumbnailUrl", "videoUrl", etc.).
