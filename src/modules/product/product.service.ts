import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { validateUpdatePayload } from 'src/common/utils/validate-update-payload.util';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { ProductResponseDto } from './dtos/ProductResponse.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductResponseMapper } from './mappers/product-response.mapper';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  public async findAll(filters: {
    category?: string;
    search?: string;
  }): Promise<ProductResponseDto[]> {
    const productEntities = await this.productRepository.find();
    return ProductResponseMapper.toResponseMany(productEntities);
  }

  public async findOne(uuid: string): Promise<ProductResponseDto> {
    const productEntity = await this.getProductById(uuid);
    return ProductResponseMapper.toResponseOne(productEntity);
  }

  public async create(dto: CreateProductDto): Promise<DefaultResponseDto> {
    await this.assertProductNotExists(dto.product);
    const product = await this.productRepository.save({
      ...dto,
      category: { id: dto.category },
    });
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      product.id,
      'Product created successfully',
    );
  }

  public async update(
    uuid: string,
    dto: UpdateProductDto,
  ): Promise<MessageResponseDto> {
    const payload = validateUpdatePayload(dto);
    const product = await this.getProductById(uuid);
    await this.productRepository.update(product.id, payload);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Product updated successfully',
    );
  }

  public async delete(uuid: string): Promise<MessageResponseDto> {
    const product = await this.getProductById(uuid);
    await this.productRepository.softDelete({ id: product.id });
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Product deleted successfully',
    );
  }

  public async getProductById(uuid: string): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id: uuid },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  private async assertProductNotExists(name: string): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { product: name },
    });
    if (product) throw new ConflictException('Product already exists');
  }
}
