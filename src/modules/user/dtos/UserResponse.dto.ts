export class UserResponseDto {
  public readonly id: string;
  public readonly cart: string | null;
  public readonly name: string;
  public readonly email: string;

  constructor(id: string, cart: string | null, name: string, email: string) {
    this.id = id;
    this.cart = cart;
    this.name = name;
    this.email = email;
  }
}
