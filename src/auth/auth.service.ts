import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { LoginUserDto } from './dtos/auth.login.dto';
import { UserDto } from 'src/user/user.dto';
import { CreateUserDto } from './dtos/auth.register.dto';
import { ConfigService } from '@nestjs/config';
import { TokenPayloadDto } from './dtos/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
  ) {}

  public async login(loginUserDto: LoginUserDto): Promise<TokenPayloadDto> {
    const userData = await this.userService.findLoginUser(loginUserDto);
    if (!userData) {
      throw new HttpException('user not found ', HttpStatus.UNAUTHORIZED);
    }
    return await this.createToken(userData);
  }

  async validateUser(payload: UserDto): Promise<UserDto> {
    const user = await this.userService.findUserById(payload.id);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  public async register(createUser: CreateUserDto): Promise<TokenPayloadDto> {
    const user = await this.userService.createNewUser(createUser);

    return await this.createToken(user);
  }

  public async createToken(user: UserDto): Promise<TokenPayloadDto> {
    const secret = this._configService.get<string>('JWT_SECRET');
    return new TokenPayloadDto({
      expiresIn: this._configService.get('JWT_EXPIRATION_TIME'),
      accessToken: await this._jwtService.signAsync({ ...user }, { secret }),
    });
  }
}
