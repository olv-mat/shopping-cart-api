export class RegisterResponseDto {
  constructor(
    public token: string,
    public user: string,
    public cart: string | null,
    public message: string,
  ) {}
}
