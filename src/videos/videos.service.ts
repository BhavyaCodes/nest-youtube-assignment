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
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    @InjectRepository(Video)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    const newVideo = this.videosRepository.create(createVideoDto);
    return this.videosRepository.save(newVideo).catch((err) => {
      // unique index conflict
      if (err.code == '23505') {
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
    const videoEntitiesData: Partial<Video>[] = items.map(
      ({ snippet, id }) => ({
        description: snippet.description,
        thumbnailUrl: snippet.thumbnails.default.url,
        id,
        title: snippet.title,
        videoUrl: `https://www.youtube.com/watch?v=${id}`,
        publishedAt: snippet.publishedAt as unknown as Date,
      }),
    );

    // console.log(
    //   this.videosRepository
    //     .createQueryBuilder()
    //     .insert()
    //     .values(videoEntitiesData.slice(0, 1))
    //     .orUpdate([], ['youtubeVideoId'], {
    //       // skipUpdateIfNoValuesChanged: true,
    //     })
    //     // .orIgnore() //  ON CONFLICT DO NOTHING
    //     .getSql(),
    //   // .execute(),
    // );

    // this.videosRepository
    //   .createQueryBuilder()
    //   .insert()
    //   .values(videoEntitiesData)
    //   .orUpdate([], ['youtubeVideoId'], {
    //     skipUpdateIfNoValuesChanged: true,
    //   })
    //   // .orIgnore() //  ON CONFLICT DO NOTHING
    //   // .getSql()
    //   .execute();

    this.videosRepository.upsert(videoEntitiesData, ['id']);
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  // @Cron('*/10 * * * * *')
  async fetchVideosCron() {
    const response = await axios
      .get<{ items: VideoSnippet[] }>(
        'https://youtube.googleapis.com/youtube/v3/videos',
        {
          params: {
            part: 'snippet',
            key: this.configService.get('YOUTUBE_API_KEY'),
            chart: 'mostPopular',
            // pageToken: 'CAUQAA',
          },
        },
      )
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });

    // console.log('fetched');
    this.addMultipleVideos(response.data.items);
  }

  async getWatchLaterByUserId(userId: string) {
    // this.usersRepository.find({
    //   relations: { watchLater: true },
    //   loadEagerRelations: false,
    //   where: {
    //     // watchLater: {
    //     //   id: userId,
    //     // },
    //     id: userId,
    //   },
    //   select: {},
    // });
    // const result = await this.usersRepository
    //   .createQueryBuilder('user')
    //   .leftJoinAndSelect('user.watchLater', 'video')
    //   .getMany();
    // console.log(result);
    // const rawData = await this.usersRepository.query(
    //   `SELECT video.title, user.id, user.email FROM user_watch_later_video LEFT JOIN "user" as p ON v`,
    // );
    // const rawData = await this.usersRepository.query(`SELECT * FROM "user"`);
    // console.log(rawData);

    const rawData = await this.usersRepository.query(
      // `SELECT * FROM user_watch_later_video p JOIN "user" on "user".id = p."userId"`,
      // `SELECT * FROM user_watch_later_video p JOIN "video" on "video".id = p."videoId"`,
      'SELECT * FROM user_watch_later_video p JOIN "video" on "video".id = p."videoId" WHERE p."userId" = $1 ;',
      [userId],
    );

    return rawData;
  }

  async addToWatchLater(videoId: string, user: any) {
    const videoToWatchLater = await this.videosRepository.findOneBy({
      id: videoId,
    });

    if (!videoToWatchLater) {
      return null;
    }

    return await this.usersRepository
      .createQueryBuilder()
      .relation(User, 'watchLater')
      .of(user.sub)
      .add(videoToWatchLater.id);
  }

  removeFromWatchLater(videoId: string, userId: string) {
    return this.usersRepository
      .createQueryBuilder()
      .relation(User, 'watchLater')
      .of(userId)
      .remove(videoId);
  }
}
