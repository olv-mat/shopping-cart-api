export class ResponseMapper {
  public static toResponse<T>(
    dto: new (...args: any[]) => T,
    ...args: ConstructorParameters<typeof dto>
  ): T {
    return new dto(...args);
  }
}
