import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';
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

  public async findAll(
    filters: { category?: string; search?: string },
    options: IPaginationOptions,
  ): Promise<{
    items: ProductEntity[];
    meta: IPaginationMeta;
  }> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (filters.category) {
      queryBuilder.andWhere('category.category = :category', {
        category: filters.category,
      });
    }

    if (filters.search) {
      queryBuilder.andWhere('product.product ILIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    queryBuilder.orderBy('product.createdAt', 'DESC');
    const { items, meta } = await paginate<ProductEntity>(
      queryBuilder,
      options,
    );

    return { items, meta };
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
