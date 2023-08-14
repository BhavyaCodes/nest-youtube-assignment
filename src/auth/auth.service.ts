import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async signup(createUserDto: CreateUserDto) {
    const hashedPassword = await this.hashPassword(createUserDto.password);

    createUserDto.password = hashedPassword;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = await this.userService.create(
      createUserDto,
    );

    return result;
  }

  async signIn(email: string, pass: string) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      //Dont wanna tell if user exists
      throw new UnauthorizedException();
    }

    const matches = await bcrypt.compare(pass, user.password);

    if (!matches) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
