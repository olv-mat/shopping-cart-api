import { Injectable } from '@nestjs/common';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserResponseDto } from './dtos/UserResponse.dto';
import { UserResponseMapper } from './mappers/user-response.mapper';
import { UserService } from './user.service';

@Injectable()
export class UserFacade {
  constructor(private readonly userService: UserService) {}

  public async findAll(): Promise<UserResponseDto[]> {
    const userEntities = await this.userService.findAll();
    return UserResponseMapper.toResponseMany(userEntities);
  }

  public async findOne(
    uuid: string,
    user: UserInterface,
  ): Promise<UserResponseDto> {
    const userEntity = await this.userService.findOne(uuid);
    checkUserPermission(user, userEntity.id);
    return UserResponseMapper.toResponseOne(userEntity);
  }

  public async update(
    user: UserInterface,
    uuid: string,
    dto: UpdateUserDto,
  ): Promise<MessageResponseDto> {
    checkUserPermission(user, uuid);
    await this.userService.update(dto, uuid);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'User updated successfully',
    );
  }

  public async delete(
    user: UserInterface,
    uuid: string,
  ): Promise<MessageResponseDto> {
    checkUserPermission(user, uuid);
    await this.userService.delete(uuid);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'User deleted successfully',
    );
  }
}
