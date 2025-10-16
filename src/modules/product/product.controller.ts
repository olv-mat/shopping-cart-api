import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UuidDto } from '../../common/dtos/Uuid.dto';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../user/enums/user-roles.enum';

@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(...Object.values(UserRoles))
  public async findAll(): Promise<ProductEntity[]> {
    return await this.productService.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  public async findOne(@Param() { uuid }: UuidDto): Promise<ProductEntity> {
    return await this.productService.findOne(uuid);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  public async create(
    @Body() dto: CreateProductDto,
  ): Promise<DefaultResponseDto> {
    return await this.productService.create(dto);
  }

  @Patch(':uuid')
  @Roles(UserRoles.ADMIN)
  public async update(
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateProductDto,
  ): Promise<DefaultResponseDto> {
    return await this.productService.update(uuid, dto);
  }

  @Delete(':uuid')
  @Roles(UserRoles.ADMIN)
  public async delete(@Param() { uuid }: UuidDto): Promise<DefaultResponseDto> {
    return await this.productService.delete(uuid);
  }
}
