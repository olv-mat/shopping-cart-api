import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/common/decorators/user.decorator';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/enums/user-roles.enum';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  public async findAll(): Promise<OrderEntity[]> {
    return this.orderService.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  public async findOne(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<OrderEntity> {
    return this.orderService.findOne(user, uuid);
  }

  @Post()
  @Roles(...Object.values(UserRoles))
  public async create(
    @User() user: UserInterface,
    @Body() dto: CreateOrderDto,
  ): Promise<DefaultResponseDto> {
    return this.orderService.create(user, dto);
  }

  @Post(':uuid/pay')
  @Roles(...Object.values(UserRoles))
  public async pay(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<DefaultResponseDto> {
    return this.orderService.pay(user, uuid);
  }

  @Delete(':uuid')
  @Roles(...Object.values(UserRoles))
  public async delete(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<DefaultResponseDto> {
    return this.orderService.delete(user, uuid);
  }
}
