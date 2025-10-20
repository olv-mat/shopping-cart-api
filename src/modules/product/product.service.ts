import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { validateUpdatePayload } from 'src/common/utils/validate-update-payload.util';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async findAll(category?: string): Promise<ProductEntity[]> {
    const where = category ? { category: { category } } : {};
    return this.productRepository.find({ where });
  }

  public async findOne(uuid: string): Promise<ProductEntity> {
    return await this.findProductById(uuid);
  }

  public async create(dto: CreateProductDto): Promise<DefaultResponseDto> {
    await this.checkProductExists(dto.product);
    const product = await this.productRepository.save({
      ...dto,
      category: { id: dto.category },
    });
    return this.responseMapper.toDefaultResponse(
      product.id,
      'Product created successfully',
    );
  }

  public async update(
    uuid: string,
    dto: UpdateProductDto,
  ): Promise<DefaultResponseDto> {
    const product = await this.findProductById(uuid);
    const updatePayload = validateUpdatePayload(dto);
    await this.productRepository.update(product.id, updatePayload);
    return this.responseMapper.toDefaultResponse(
      uuid,
      'Product updated successfully',
    );
  }

  public async delete(uuid: string): Promise<DefaultResponseDto> {
    const product = await this.findProductById(uuid);
    await this.productRepository.softDelete({ id: product.id });
    return this.responseMapper.toDefaultResponse(
      product.id,
      'Product deleted successfully',
    );
  }

  public async findProductById(uuid: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: uuid },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  private async checkProductExists(name: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { product: name },
    });
    if (product) {
      throw new ConflictException('Product already exists');
    }
  }
}
