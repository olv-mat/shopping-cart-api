import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { validateUpdatePayload } from 'src/common/utils/validate-update-payload.util';
import { Repository } from 'typeorm';
import { RegisterDto } from '../auth/dtos/Register.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UserEntity } from './entities/user.entity';
import { UserRoles } from './enums/user-roles.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  public async findOne(uuid: string): Promise<UserEntity> {
    return await this.getUserById(uuid);
  }

  public async create(dto: RegisterDto, admin: boolean): Promise<UserEntity> {
    await this.assertEmailNotUsed(dto.email);
    return await this.userRepository.save({
      ...dto,
      password: await bcrypt.hash(dto.password, 10),
      ...(admin && { role: UserRoles.ADMIN }),
    });
  }

  public async update(dto: UpdateUserDto, uuid: string): Promise<void> {
    const payload = validateUpdatePayload(dto);
    const user = await this.getUserById(uuid);
    if (payload.email) await this.assertEmailNotUsed(payload.email);
    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 10);
    }
    await this.userRepository.update(user.id, payload);
  }

  public async delete(uuid: string): Promise<void> {
    const user = await this.getUserById(uuid);
    await this.userRepository.delete(user.id);
  }

  public async getUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ email: email });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async getUserById(uuid: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: uuid } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  private async assertEmailNotUsed(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) throw new ConflictException('Email already in use');
  }
}
