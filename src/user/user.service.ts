import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginUserDto } from 'src/auth/dtos/auth.login.dto';
import { CreateUserDto } from 'src/auth/dtos/auth.register.dto';
import { Product } from 'src/products/product.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async findLoginUser(loginUserDto: LoginUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.UNAUTHORIZED);
    }
    const compared = await bcrypt.compare(loginUserDto.password, user.password);

    if (!compared) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async findUserById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }
  async createNewUser(createUserDto: CreateUserDto): Promise<UserDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = await this.userRepository.create(createUserDto);

    const user = await this.userRepository.save(newUser);
    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async getUserProducts(userid: number): Promise<Product[]> {
    const user = await this.userRepository.findOne({
      where: { id: userid },
      relations: { products: true },
    });

    return user.products;
  }
}
