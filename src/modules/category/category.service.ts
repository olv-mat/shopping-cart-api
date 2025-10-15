import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DefaultResponseDto } from '../../common/dtos/DefaultResponse.dto';
import { ResponseMapper } from '../../common/mappers/response.mapper';
import { CategoryDto } from './dtos/Category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find();
  }

  public async findOne(uuid: string): Promise<CategoryEntity> {
    return await this.findCategoryById(uuid);
  }

  public async create(dto: CategoryDto): Promise<DefaultResponseDto> {
    await this.checkCategoryExists(dto.category);
    const category = await this.categoryRepository.save(dto);
    return this.responseMapper.toDefaultResponse(
      category.id,
      'Category created successfully',
    );
  }

  public async update(
    uuid: string,
    dto: CategoryDto,
  ): Promise<DefaultResponseDto> {
    const category = await this.findCategoryById(uuid);
    await this.categoryRepository.update(category.id, dto);
    return this.responseMapper.toDefaultResponse(
      uuid,
      'Category updated successfully',
    );
  }

  public async delete(uuid: string): Promise<DefaultResponseDto> {
    const category = await this.findCategoryById(uuid);
    await this.categoryRepository.delete(category.id);
    return this.responseMapper.toDefaultResponse(
      uuid,
      'Category deleted successfully',
    );
  }

  private async findCategoryById(uuid: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: uuid },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  private async checkCategoryExists(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { category: name },
    });
    if (category) {
      throw new ConflictException('Category already exists');
    }
  }
}
