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
  public findAll(): Promise<CategoryResponseDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<CategoryResponseDto> {
    return this.categoryService.findOne(uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerConflict()
  @SwaggerInternalServerError()
  public create(@Body() dto: CategoryDto): Promise<DefaultResponseDto> {
    return this.categoryService.create(dto);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: CategoryDto,
  ): Promise<MessageResponseDto> {
    return this.categoryService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation({ summary: 'Delete a specific category' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public delete(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<MessageResponseDto> {
    return this.categoryService.delete(uuid);
  }
}
