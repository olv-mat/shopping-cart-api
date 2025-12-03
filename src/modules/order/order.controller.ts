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
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import {
  SwaggerCreated,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOk,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRoles } from '../user/enums/user-roles.enum';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderResponseDto } from './dtos/OrderResponse.dto';
import { OrderFacade } from './order.facade';

@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve all orders' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerInternalServerError()
  public findAll(): Promise<OrderResponseDto[]> {
    return this.orderFacade.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Retrieve a specific order' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public findOne(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
  ): Promise<OrderResponseDto> {
    return this.orderFacade.findOne(uuid, user);
  }

  @Post()
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Create a new order' })
  @SwaggerCreated()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public create(
    @Body() dto: CreateOrderDto,
    @User() user: UserInterface,
  ): Promise<DefaultResponseDto> {
    return this.orderFacade.create(dto, user);
  }

  @Post(':uuid/pay')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Mark a specific order as paid' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public pay(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
  ): Promise<MessageResponseDto> {
    return this.orderFacade.pay(uuid, user);
  }

  @Delete(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Delete a specific order' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public delete(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
  ): Promise<MessageResponseDto> {
    return this.orderFacade.delete(uuid, user);
  }
}
