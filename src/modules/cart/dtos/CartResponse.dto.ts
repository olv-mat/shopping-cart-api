import { UserResponseDto } from 'src/modules/user/dtos/UserResponse.dto';
import { CartStatus } from '../enums/cart-status.enum';
import { CartItemResponseDto } from './CartItemResponse.dto';

export class CartResponseDto {
  public readonly id: string;
  public readonly user: UserResponseDto;
  public readonly status: CartStatus;
  public readonly items: CartItemResponseDto[];

  constructor(
    id: string,
    user: UserResponseDto,
    status: CartStatus,
    items: CartItemResponseDto[],
  ) {
    this.id = id;
    this.user = user;
    this.status = status;
    this.items = items;
  }
}
