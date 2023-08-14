import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  create(@Body() createVideoDto: CreateVideoDto) {
    return this.videosService.create(createVideoDto);
  }

  @Get()
  findAll() {
    return this.videosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Post('watchlater/:id')
  async wishlist(@Param('id') youtubeVideoId: string, @Request() req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    try {
      await this.videosService.addToWatchLater(youtubeVideoId, req.user);
      return { message: 'video wishlisted', videoId: youtubeVideoId };
    } catch (error: any) {
      // unique index conflict
      if (error.code == '23505') {
        // not sending error code on purpose
        return {
          message: 'video already in wishlist',
          videoId: youtubeVideoId,
        };
      }
      throw new InternalServerErrorException();
    }
  }
}
