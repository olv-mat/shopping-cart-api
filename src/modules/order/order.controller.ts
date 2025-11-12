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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  endpointProperties,
  endpointResponses,
} from 'src/common/utils/swagger-properties';

const properties = endpointProperties.oder;
const responses = endpointResponses;

@Controller('orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation(properties.findAll)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbidden)
  @ApiResponse(responses.internalServerError)
  public async findAll(): Promise<OrderEntity[]> {
    return this.orderService.findAll();
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
  ): Promise<OrderEntity> {
    return this.orderService.findOne(user, uuid);
  }

  @Post()
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.create)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbiddenAction)
  @ApiResponse(responses.notFound)
  @ApiResponse(responses.internalServerError)
  public async create(
    @User() user: UserInterface,
    @Body() dto: CreateOrderDto,
  ): Promise<DefaultResponseDto> {
    return this.orderService.create(user, dto);
  }

  @Post(':uuid/pay')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.pay)
  @ApiResponse(responses.unauthorized)
  @ApiResponse(responses.forbiddenAction)
  @ApiResponse(responses.notFound)
  @ApiResponse(responses.internalServerError)
  public async pay(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
  ): Promise<DefaultResponseDto> {
    return this.orderService.pay(user, uuid);
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
    return this.orderService.delete(user, uuid);
  }
}
