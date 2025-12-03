import { OrderStatus } from '../enums/order-status.enum';

export class OrderResponseDto {
  public readonly id: string;
  public readonly totalPrice: string;
  public readonly status: OrderStatus;

  constructor(id: string, totalPrice: string, status: OrderStatus) {
    this.id = id;
    this.totalPrice = totalPrice;
    this.status = status;
  }
}
