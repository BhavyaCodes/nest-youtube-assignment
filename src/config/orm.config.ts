import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Video } from 'src/videos/entities/video.entity';

export default registerAs('orm.config', (): TypeOrmModuleOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Video, User],
    // @@@@@@@@@@@@@@@@@@@@@ NEVER USE synchronize in real world production app @@@@@@@@@@@@@@@@@@@@@@@@@@
    // synchronize: process.env.NODE_ENV === 'production' ? false : true,
    synchronize: true,
  };
});
