import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateVideoDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  publishedAt: string;

  @IsUrl()
  thumbnailUrl: string;

  @IsUrl()
  videoUrl: string;
}
