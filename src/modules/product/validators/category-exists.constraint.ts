import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { Repository } from 'typeorm';
import { validate as isUuid } from 'uuid';

@ValidatorConstraint({ async: true })
@Injectable()
export class CategoryExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  public async validate(uuid: string): Promise<boolean> {
    if (!isUuid(uuid)) {
      return false;
    }
    return await this.categoryRepository.exists({ where: { id: uuid } });
  }
}
