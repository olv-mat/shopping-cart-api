import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import {
  SwaggerBadRequest,
  SwaggerForbidden,
  SwaggerInternalServerError,
  SwaggerNotFound,
  SwaggerOk,
  SwaggerUnauthorized,
} from 'src/common/swagger/responses.swagger';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { UpdateCartItemDto } from '../dtos/UpdateCartItem.dto';
import { CartItemFacade } from '../facades/cart-item.facade';

@ApiTags('Cart Item')
@ApiBearerAuth()
@Controller('carts/:uuid/items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartItemController {
  constructor(private readonly cartItemFacade: CartItemFacade) {}

  @Patch('increase')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Increase quantity of a cart item' })
  @SwaggerOk()
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public increase(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
    @Body() dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    return this.cartItemFacade.increase(uuid, user, dto);
  }

  @Patch('decrease')
  @Roles(...Object.values(UserRoles))
  @ApiOperation({ summary: 'Decrease quantity of a cart item' })
  @SwaggerOk()
  @SwaggerBadRequest()
  @SwaggerUnauthorized()
  @SwaggerForbidden()
  @SwaggerNotFound()
  @SwaggerInternalServerError()
  public decrease(
    @Param() { uuid }: UuidDto,
    @User() user: UserInterface,
    @Body() dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    return this.cartItemFacade.decrease(uuid, user, dto);
  }
}
