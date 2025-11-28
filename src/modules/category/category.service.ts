import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryDto } from './dtos/Category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  public findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepository.find();
  }

  public findOne(uuid: string): Promise<CategoryEntity> {
    return this.getCategoryById(uuid);
  }

  public async create(dto: CategoryDto): Promise<CategoryEntity> {
    await this.assertCategoryNotExists(dto.category);
    return this.categoryRepository.save(dto);
  }

  public async update(uuid: string, dto: CategoryDto): Promise<void> {
    const category = await this.getCategoryById(uuid);
    await this.categoryRepository.update(category.id, dto);
  }

  public async delete(uuid: string): Promise<void> {
    const category = await this.getCategoryById(uuid);
    await this.categoryRepository.delete(category.id);
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
