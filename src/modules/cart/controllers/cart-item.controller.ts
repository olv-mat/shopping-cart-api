import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UuidDto } from 'src/common/dtos/Uuid.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { UserRoles } from 'src/modules/user/enums/user-roles.enum';
import { UpdateCartItemDto } from '../dtos/UpdateCartItem.dto';
import { CartItemService } from '../services/cart-item.service';
import { endpointProperties } from 'src/common/utils/swagger-properties';

const properties = endpointProperties.cartItem;

@ApiTags('Cart Item')
@Controller('carts/:uuid/items')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Patch('increase')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.increase)
  public async increase(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    return this.cartItemService.increase(user, uuid, dto);
  }

  @Patch('decrease')
  @Roles(...Object.values(UserRoles))
  @ApiOperation(properties.decrease)
  public async decrease(
    @User() user: UserInterface,
    @Param() { uuid }: UuidDto,
    @Body() dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    return this.cartItemService.decrease(user, uuid, dto);
  }
}
