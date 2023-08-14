import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  UnauthorizedException,
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
  wishlist(@Param('id') youtubeVideoId: string, @Request() req) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    console.log(req.user);
    return this.videosService.addToWatchLater(youtubeVideoId, req.user);
  }
}
