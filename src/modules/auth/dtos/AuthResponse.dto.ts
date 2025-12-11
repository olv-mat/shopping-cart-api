export class AuthResponseDto {
  public readonly sub: string;
  public readonly token: string;

  constructor(sub: string, token: string) {
    this.sub = sub;
    this.token = token;
  }
}
