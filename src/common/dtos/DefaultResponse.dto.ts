export class DefaultResponseDto {
  readonly uuid: string;
  readonly message: string;

  constructor(uuid: string, message: string) {
    this.uuid = uuid;
    this.message = message;
  }
}
