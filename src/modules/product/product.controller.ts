import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UuidDto } from '../../common/dtos/Uuid.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/enums/user-roles.enum';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

// npm install nestjs-typeorm-paginate

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(...Object.values(UserRoles))
  public async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<{
    items: ProductEntity[];
    meta: IPaginationMeta;
  }> {
    return this.productService.findAll({ category, search }, { page, limit });
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  public async findOne(@Param() { uuid }: UuidDto): Promise<ProductEntity> {
    return this.productService.findOne(uuid);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  public async create(
    @Body() dto: CreateProductDto,
  ): Promise<DefaultResponseDto> {
    return this.productService.create(dto);
  }

  @Patch(':uuid')
  @Roles(UserRoles.ADMIN)
  public async update(
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateProductDto,
  ): Promise<DefaultResponseDto> {
    return this.productService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Roles(UserRoles.ADMIN)
  public async delete(@Param() { uuid }: UuidDto): Promise<DefaultResponseDto> {
    return this.productService.delete(uuid);
  }
}
