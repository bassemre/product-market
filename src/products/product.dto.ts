import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  price: number;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Buffer;
}
export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  price?: number;

  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({ type: 'string', format: 'binary' })
  image?: Buffer;
}
