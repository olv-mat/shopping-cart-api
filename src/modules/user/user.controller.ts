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
import { User } from 'src/common/decorators/user.decorator';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  public async findAll(): Promise<UserEntity[]> {
    return await this.userService.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  public async findOne(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<UserEntity> {
    return await this.userService.findOne(user, uuid);
  }

  @Patch(':uuid')
  @Roles(...Object.values(UserRoles))
  public async update(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    return await this.userService.update(user, uuid, dto);
  }

  @Delete(':uuid')
  @Roles(...Object.values(UserRoles))
  public async delete(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<DefaultResponseDto> {
    return await this.userService.delete(user, uuid);
  }
}
