import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import {
  endpointProperties,
  endpointResponses,
} from 'src/common/utils/swagger-properties';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';
import { UserService } from './user.service';

const properties = endpointProperties.user;
const responses = endpointResponses;

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation(properties.findAll)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbidden)
  @ApiResponse(responses.internalServerError)
  public async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.findOne)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbiddenAction)
  @ApiResponse(responses.notFound)
  @ApiResponse(responses.internalServerError)
  public async findOne(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<UserEntity> {
    return this.userService.findOne(user, uuid);
  }

  @Patch(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.update)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbiddenAction)
  @ApiResponse(responses.notFound)
  @ApiResponse(responses.internalServerError)
  public async update(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    return this.userService.update(user, uuid, dto);
  }

  @Delete(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.delete)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbiddenAction)
  @ApiResponse(responses.notFound)
  @ApiResponse(responses.internalServerError)
  public async delete(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<DefaultResponseDto> {
    return this.userService.delete(user, uuid);
  }
}
