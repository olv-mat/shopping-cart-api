import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
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
import { DefaultResponseDto } from '../../common/dtos/DefaultResponse.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/enums/user-roles.enum';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/Category.dto';
import { CategoryResponseDto } from './dtos/CategoryResponse.dto';
import { CategoryResponseMapper } from './mappers/category-response.mapper';

@ApiBearerAuth()
@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerInternalServerError()
  public async findAll(): Promise<CategoryResponseDto[]> {
    const categoryEntities = await this.categoryService.findAll();
    return CategoryResponseMapper.toResponseMany(categoryEntities);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<CategoryResponseDto> {
    const categoryEntity = await this.categoryService.findOne(uuid);
    return CategoryResponseMapper.toResponseOne(categoryEntity);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public async create(@Body() dto: CategoryDto): Promise<DefaultResponseDto> {
    const categoryEntity = await this.categoryService.create(dto);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      categoryEntity.id,
      'Category created successfully',
    );
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: CategoryDto,
  ): Promise<MessageResponseDto> {
    await this.categoryService.update(uuid, dto);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Category updated successfully',
    );
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public async delete(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<MessageResponseDto> {
    await this.categoryService.delete(uuid);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Category deleted successfully',
    );
  }
}
