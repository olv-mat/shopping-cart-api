import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  ) {}

  public findAll(filters: {
    category?: string;
    search?: string;
  }): Promise<ProductEntity[]> {
    return this.productRepository.find();
  }

  public findOne(uuid: string): Promise<ProductEntity> {
    return this.getProductById(uuid);
  }

  public async create(dto: CreateProductDto): Promise<ProductEntity> {
    await this.assertProductNotExists(dto.product);
    return this.productRepository.save({
      ...dto,
      category: { id: dto.category },
    });
  }

  public async update(dto: UpdateProductDto, uuid: string): Promise<void> {
    const payload = validateUpdatePayload(dto);
    const product = await this.getProductById(uuid);
    Object.assign(product, payload);
    await this.productRepository.save(product);
  }

  public async delete(uuid: string): Promise<void> {
    const product = await this.getProductById(uuid);
    await this.productRepository.softDelete({ id: product.id });
  }

  private async getProductById(uuid: string): Promise<ProductEntity> {
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
