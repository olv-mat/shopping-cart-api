export class AuthResponseDto {
  readonly sub: string;
  readonly token: string;

  constructor(sub: string, token: string) {
    this.sub = sub;
    this.token = token;
  }
}
