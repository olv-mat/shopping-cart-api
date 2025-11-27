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
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import {
  SwaggerConflict,
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOk,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { UuidDto } from '../../common/dtos/Uuid.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/enums/user-roles.enum';
import { CreateProductDto } from './dtos/CreateProduct.dto';
import { ProductResponseDto } from './dtos/ProductResponse.dto';
import { UpdateProductDto } from './dtos/UpdateProduct.dto';
import { ProductResponseMapper } from './mappers/product-response.mapper';
import { ProductService } from './product.service';

// npm install nestjs-typeorm-paginate

@ApiBearerAuth()
@Controller('products')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Retrieve all products with optional filters' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'search', required: false })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerInternalServerError()
  public async findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<ProductResponseDto[]> {
    const productEntities = await this.productService.findAll({
      category,
      search,
    });
    return ProductResponseMapper.toResponseMany(productEntities);
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Retrieve a specific product' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async findOne(
    @Param() { uuid }: UuidDto,
  ): Promise<ProductResponseDto> {
    const productEntity = await this.productService.findOne(uuid);
    return ProductResponseMapper.toResponseOne(productEntity);
  }

  @Post()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Create a new product' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public async create(
    @Body() dto: CreateProductDto,
  ): Promise<DefaultResponseDto> {
    const productEntity = await this.productService.create(dto);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      productEntity.id,
      'Product created successfully',
    );
  }

  @Patch(':uuid')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Update a specific product' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async update(
    @Body() dto: UpdateProductDto,
    @Param() { uuid }: UuidDto,
  ): Promise<MessageResponseDto> {
    await this.productService.update(dto, uuid);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Product updated successfully',
    );
  }

  @Delete(':uuid')
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Delete a specific product' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async delete(@Param() { uuid }: UuidDto): Promise<MessageResponseDto> {
    await this.productService.delete(uuid);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Product deleted successfully',
    );
  }
}
