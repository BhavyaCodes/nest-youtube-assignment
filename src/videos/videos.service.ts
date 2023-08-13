import {
  BadRequestException,
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

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private configService: ConfigService,
  ) {}
  create(createVideoDto: CreateVideoDto) {
    // return 'This action adds a new video';
    const newVideo = this.videosRepository.create(createVideoDto);

    return this.videosRepository.save(newVideo);
  }

  findAll() {
    // return `This action returns all videos`;
    return this.videosRepository.find();
  }

  async findOne(id: string) {
    // return `This action returns a #${id} video`;
    const video = await this.videosRepository.findOneBy({ id });
    console.log(video);
    if (!video) {
      throw new BadRequestException('Video not found');
    }
    return video;
  }

  // update(id: number, updateVideoDto: UpdateVideoDto) {
  //   return `This action updates a #${id} video`;
  // }

  remove(id: number) {
    return `This action removes a #${id} video`;
  }

  // @Cron(CronExpression.EVERY_30_SECONDS)
  @Cron('*/10 * * * * *')
  async fetchVideosCron() {
    const data = await axios
      .get('https://youtube.googleapis.com/youtube/v3/videos', {
        params: {
          part: 'snippet',
          key: this.configService.get('YOUTUBE_API_KEY'),
          chart: 'mostPopular',
        },
      })
      .catch((err) => {
        throw new InternalServerErrorException(err);
      });
    console.log(data.data);
    console.log('cron');
  }
}
