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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import {
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOk,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserRoles } from './enums/user-roles.enum';
import { UserFacade } from './user.facade';

@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userFacade: UserFacade) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve all users' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerInternalServerError()
  public findAll(): Promise<UserResponseDto[]> {
    return this.userFacade.findAll();
  }

  @Get('/me')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Retrieve current user' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public findMe(@User() user: UserInterface): Promise<UserResponseDto> {
    return this.userFacade.findMe(user);
  }

  @Patch(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Update a specific user' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public update(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateUserDto,
  ): Promise<MessageResponseDto> {
    return this.userFacade.update(user, uuid, dto);
  }

  @Delete(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Delete a specific user' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public delete(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<MessageResponseDto> {
    return this.userFacade.delete(user, uuid);
  }
}
