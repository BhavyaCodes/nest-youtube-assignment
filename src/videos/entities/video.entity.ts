import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// Define an entity (e.g., "Video") to store video details
//(e.g., "id", "title", "description", "publishedAt", "thumbnailUrl", "videoUrl", etc.).
@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 2000, nullable: true })
  description: string;

  @Column({
    type: 'timestamptz',
  })
  publishedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: false })
  thumbnailUrl: string;

  @Column({ type: 'varchar', length: 300, nullable: false })
  videoUrl: string;
}
