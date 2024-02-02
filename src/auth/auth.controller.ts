import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UserDto } from 'src/user/user.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dtos/auth.login.dto';
import { CreateUserDto } from './dtos/auth.register.dto';
import { TokenPayloadDto } from './dtos/token-payload.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<TokenPayloadDto> {
    return await this.authService.register(createUserDto);
  }

  @Post('login')
  public async login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<TokenPayloadDto> {
    return await this.authService.login(loginUserDto);
  }
}
