import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { validateUpdatePayload } from 'src/common/utils/validate-update-payload.util';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findOne(user: UserInterface, uuid: string): Promise<UserEntity> {
    checkUserPermission(user, uuid);
    return await this.findUserById(uuid);
  }

  public async update(
    user: UserInterface,
    uuid: string,
    dto: UpdateUserDto,
  ): Promise<DefaultResponseDto> {
    checkUserPermission(user, uuid);

    const storedUser = await this.findUserById(uuid);
    const updatePayload = validateUpdatePayload(dto);

    if (updatePayload.email) {
      await this.validateEmail(updatePayload.email);
    }

    if (updatePayload.password) {
      updatePayload.password = await bcrypt.hash(updatePayload.password, 10);
    }

    await this.userRepository.update(storedUser.id, updatePayload);
    return this.responseMapper.toDefaultResponse(
      storedUser.id,
      'User updated successfully',
    );
  }

  public async delete(
    user: UserInterface,
    uuid: string,
  ): Promise<DefaultResponseDto> {
    checkUserPermission(user, uuid);
    const storedUser = await this.findUserById(uuid);
    await this.userRepository.delete(storedUser.id);
    return this.responseMapper.toDefaultResponse(
      storedUser.id,
      'User deleted successfully',
    );
  }

  public async findUserById(uuid: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: uuid } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  private async validateEmail(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new ConflictException('Email already in use');
    }
  }
}
