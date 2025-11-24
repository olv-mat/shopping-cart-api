export class CategoryResponseDto {
  public readonly id: string;
  public readonly category: string;

  constructor(id: string, category: string) {
    this.id = id;
    this.category = category;
  }
}
