import { Column, Entity, PrimaryGeneratedColumn, AfterInsert } from 'typeorm';

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

  @AfterInsert()
  logInsert() {
    console.log('Inserted video with id', this.id);
  }
}

// Define an entity (e.g., "Video") to store video details
//(e.g., "id", "title", "description", "publishedAt", "thumbnailUrl", "videoUrl", etc.).
