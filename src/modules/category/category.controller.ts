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
import { DefaultResponseDto } from '../../common/dtos/DefaultResponse.dto';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/Category.dto';
import { CategoryEntity } from './entities/category.entity';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRoles } from '../user/enums/user-roles.enum';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  endpointProperties,
  endpointResponses,
} from 'src/common/utils/swagger-properties';

const properties = endpointProperties.category;
const responses = endpointResponses;

@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRoles.ADMIN)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation(properties.findAll)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.internalServerError)
  public async findAll(): Promise<CategoryEntity[]> {
    return this.categoryService.findAll();
  }

  @Get(':uuid')
  @ApiOperation(properties.findOne)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.internalServerError)
  public async findOne(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<CategoryEntity> {
    return this.categoryService.findOne(uuid);
  }

  @Post()
  @ApiOperation(properties.create)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.internalServerError)
  public async create(@Body() dto: CategoryDto): Promise<DefaultResponseDto> {
    return this.categoryService.create(dto);
  }

  @Put(':uuid')
  @ApiOperation(properties.update)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.internalServerError)
  public async update(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
    @Body() dto: CategoryDto,
  ): Promise<DefaultResponseDto> {
    return this.categoryService.update(uuid, dto);
  }

  @Delete(':uuid')
  @ApiOperation(properties.delete)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.internalServerError)
  public async delete(
    @Param('uuid', new ParseUUIDPipe()) uuid: string,
  ): Promise<DefaultResponseDto> {
    return this.categoryService.delete(uuid);
  }
}
