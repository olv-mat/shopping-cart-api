export class UserResponseDto {
  public readonly userId: string;
  public readonly cartId: string | null;
  public readonly name: string;
  public readonly email: string;

  constructor(
    userId: string,
    cartId: string | null,
    name: string,
    email: string,
  ) {
    this.userId = userId;
    this.cartId = cartId;
    this.name = name;
    this.email = email;
  }
}
