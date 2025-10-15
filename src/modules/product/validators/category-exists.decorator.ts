import { registerDecorator, ValidationOptions } from 'class-validator';
import { CategoryExistsConstraint } from './category-exists.constraint';

export function CategoryExists(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'CategoryExists',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: CategoryExistsConstraint,
    });
  };
}
