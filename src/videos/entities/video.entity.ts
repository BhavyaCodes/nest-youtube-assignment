import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500, nullable: false })
  title: string;

  @Column({ length: 2000, nullable: true })
  description: string;

  @Column({
    type: 'timestamptz',
  })
  publishedAt: Date;

  @Column({ length: 300, nullable: false })
  thumbnailUrl: string;

  @Column({ length: 300, nullable: false })
  videoUrl: string;
}

// Define an entity (e.g., "Video") to store video details
//(e.g., "id", "title", "description", "publishedAt", "thumbnailUrl", "videoUrl", etc.).
