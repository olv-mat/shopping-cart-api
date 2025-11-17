import { ApiProperty } from '@nestjs/swagger';

export const EmailProperty = () =>
  ApiProperty({
    example: 'john.doe@test.com',
    description: 'User email address',
  });

export const PasswordProperty = () =>
  ApiProperty({
    example: '@JohnDoe123',
    description: 'User password',
  });

export const NameProperty = () =>
  ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  });

export const ProductIdProperty = () =>
  ApiProperty({
    example: '7a8df8f3-aaf8-4c30-b175-d64cc6b530c8',
    description: 'Product uuid',
  });

export const QuantityProperty = () =>
  ApiProperty({
    example: 1,
    description: 'Product quantity',
  });

export const CategoryNameProperty = () =>
  ApiProperty({
    example: 'eletronics',
    description: 'Category name',
  });

export const CartIdProperty = () =>
  ApiProperty({
    example: '5d5263d5-8e18-4845-8da0-3f550c18a99e',
    description: 'Cart uuid',
  });

export const ProductNameProperty = () =>
  ApiProperty({
    example: 'Play Station 5',
    description: 'Product name',
  });

export const CategoryIdProperty = () =>
  ApiProperty({
    example: 'c3a1155a-ac2b-411b-9fd7-2f477b4b2769',
    description: 'Category uuid',
  });

export const PriceProperty = () =>
  ApiProperty({
    example: '4499.99',
    description: 'Product price',
  });
