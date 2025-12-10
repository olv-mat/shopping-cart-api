import { OrderResponseDto } from '../dtos/OrderResponse.dto';
import { OrderEntity } from '../entities/order.entity';

export class OrderResponseMapper {
  public static toResponseMany = (orderEntities: OrderEntity[]) =>
    this.toDtoList(orderEntities);

  public static toResponseOne = (orderEntity: OrderEntity) =>
    this.toDto(orderEntity);

  private static toDtoList(orderEntities: OrderEntity[]): OrderResponseDto[] {
    return orderEntities.map((orderEntity) => this.toDto(orderEntity));
  }

  public static toDto(orderEntity: OrderEntity): OrderResponseDto {
    const { id, totalPrice, status } = orderEntity;
    return new OrderResponseDto(id, totalPrice, status);
  }
}
