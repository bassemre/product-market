import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { allowedMimeTypes } from './static/mimTypes.const';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { UserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly userService: UserService,
  ) {}

  async addProduct(productData: CreateProductDto, user): Promise<Product> {
    const { fileTypeFromBuffer } = await (eval(
      'import("file-type")',
    ) as Promise<typeof import('file-type')>);

    const { title, price, image } = productData;

    const fileTypeInfo = await fileTypeFromBuffer(image);

    if (!allowedMimeTypes.includes(fileTypeInfo?.mime || ''))
      throw new BadRequestException('Not allowed file type');

    const newProducts = this.productRepo.create({
      title,
      price,
      image: image,
    });

    newProducts.user = user;
    return await this.productRepo.save(newProducts);
  }

  async updateProduct(
    UpdateProductData: UpdateProductDto,
    id: number,
    user: UserDto,
  ): Promise<any> {
    const { image } = UpdateProductData;

    const product = await this.productRepo.findOne({
      where: { id },
      relations: { user: true },
    });

    if (product?.user?.id !== user.id) {
      throw new HttpException(
        'this user has no premisssion to update this product ',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { fileTypeFromBuffer } = await (eval(
      'import("file-type")',
    ) as Promise<typeof import('file-type')>);

    const fileTypeInfo = await fileTypeFromBuffer(image);

    if (!allowedMimeTypes.includes(fileTypeInfo?.mime || ''))
      throw new BadRequestException('Not allowed file type');

    return await this.productRepo.update({ id }, UpdateProductData);
  }

  async getUserProducts(userId: number): Promise<Product[]> {
    return await this.userService.getUserProducts(userId);
  }

  async deleteUserProduct(userId: number, productId: number): Promise<any> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      relations: { user: true },
    });

    if (product?.user?.id !== userId) {
      throw new HttpException(
        'this user has no premisssion to update this product ',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return await this.productRepo.delete({ id: productId });
  }
}
