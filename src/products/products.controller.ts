import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UploadGuardImage } from 'src/utils/upload.middleware';
import { UploadFile } from 'src/utils/file.decorator';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  async getUserProducts(@Req() req): Promise<Product[]> {
    const { user } = req;
    return await this.productService.getUserProducts(user.id);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'adding title,price and image for product',
    type: CreateProductDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseGuards(UploadGuardImage)
  async addProduct(
    @UploadFile() file,
    @Req() req,
    @Body() { title, price },
  ): Promise<Product> {
    const user = req.user;
    const productData = { title, price, image: file[0]?.buffer };
    return await this.productService.addProduct(productData, user);
  }

  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'updating title,price and image for product',
    type: UpdateProductDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @Patch('/:productid')
  @UseGuards(UploadGuardImage)
  async updateProduct(
    @UploadFile() file,
    @Req() req,
    @Param('productid') id: number,
    @Body() { title, price },
  ): Promise<Product> {
    const user = req.user;
    const UpdateProductData = { title, price, image: file[0]?.buffer };
    return await this.productService.updateProduct(UpdateProductData, id, user);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'productid', type: 'number' })
  @Delete('/:productid')
  @UseGuards(AuthGuard('jwt'))
  async deleteUserProduct(
    @Req() req,
    @Param('productid') productId: number,
  ): Promise<any> {
    const { user } = req;
    return await this.productService.deleteUserProduct(user.id, productId);
  }
}
