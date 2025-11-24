import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { Repository } from 'typeorm';
import { DefaultResponseDto } from '../../common/dtos/DefaultResponse.dto';
import { ResponseMapper } from '../../common/mappers/response.mapper';
import { CategoryDto } from './dtos/Category.dto';
import { CategoryResponseDto } from './dtos/CategoryResponse.dto';
import { CategoryEntity } from './entities/category.entity';
import { CategoryResponseMapper } from './mappers/category-response.mapper';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  public async findAll(): Promise<CategoryResponseDto[]> {
    const categoryEntities = await this.categoryRepository.find();
    return CategoryResponseMapper.toResponseMany(categoryEntities);
  }

  public async findOne(uuid: string): Promise<CategoryResponseDto> {
    const categoryEntity = await this.getCategoryById(uuid);
    return CategoryResponseMapper.toResponseOne(categoryEntity);
  }

  public async create(dto: CategoryDto): Promise<DefaultResponseDto> {
    await this.assertCategoryNotExists(dto.category);
    const category = await this.categoryRepository.save(dto);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      category.id,
      'Category created successfully',
    );
  }

  public async update(
    uuid: string,
    dto: CategoryDto,
  ): Promise<MessageResponseDto> {
    const category = await this.getCategoryById(uuid);
    await this.categoryRepository.update(category.id, dto);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Category updated successfully',
    );
  }

  public async delete(uuid: string): Promise<MessageResponseDto> {
    const category = await this.getCategoryById(uuid);
    await this.categoryRepository.delete(category.id);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Category deleted successfully',
    );
  }

  private async getCategoryById(uuid: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id: uuid },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  private async assertCategoryNotExists(name: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { category: name },
    });
    if (category) throw new ConflictException('Category already exists');
  }
}
