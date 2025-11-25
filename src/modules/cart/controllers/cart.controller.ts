import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import {
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOk,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { CartResponseDto } from '../dtos/CartResponse.dto';
import { CartFacade } from '../facades/cart.facade';

@ApiBearerAuth()
@Controller('carts')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartController {
  constructor(private readonly cartFacade: CartFacade) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @ApiOperation({ summary: 'Retrieve all carts' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerInternalServerError()
  public findAll(): Promise<CartResponseDto[]> {
    return this.cartFacade.findAll();
  }

  @Get(':uuid')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Retrieve a specific cart' })
  @SwaggerOk()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public findOne(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
  ): Promise<CartResponseDto> {
    return this.cartFacade.findOne(uuid, user);
  }
}
