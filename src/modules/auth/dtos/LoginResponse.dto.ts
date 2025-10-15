export class LoginResponseDto {
  constructor(
    public token: string,
    public user: string,
    public cart: string | null,
  ) {}
}
