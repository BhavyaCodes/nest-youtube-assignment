import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video.dto';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { VideoSnippet } from 'src/types';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private configService: ConfigService,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    const newVideo = this.videosRepository.create(createVideoDto);
    return this.videosRepository.save(newVideo).catch((err) => {
      if (err.code == 23505) {
        throw new HttpException('video already exists', HttpStatus.CONFLICT);
      }
      throw new InternalServerErrorException();
    });
  }

  findAll() {
    return this.videosRepository.find();
  }

  async findOne(id: string) {
    const video = await this.videosRepository.findOneBy({ id });
    if (!video) {
      throw new BadRequestException('Video not found');
    }
    return video;
  }

  addMultipleVideos(items: VideoSnippet[]) {
    const videoEntitiesData: Omit<
      Video,
      'id' | 'entryCreatedAt' | 'logInsert'
    >[] = items.map(({ snippet, id }) => ({
      description: snippet.description,
      thumbnailUrl: snippet.thumbnails.default.url,
      youtubeVideoId: id,
      title: snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${id}`,
      publishedAt: snippet.publishedAt as unknown as Date,
    }));

    this.videosRepository
      .createQueryBuilder()
      .insert()
      .values(videoEntitiesData)
      .execute();
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron('*/10 * * * * *')
  async fetchVideosCron() {
    const response = await axios
      .get<{ items: VideoSnippet[] }>(
        'https://youtube.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet',
            key: this.configService.get('YOUTUBE_API_KEY'),
            chart: 'mostPopular',
          },
        },
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    this.addMultipleVideos(response.data.items);
  }
}
