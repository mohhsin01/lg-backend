import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueConstraint } from './unique.constraint';

export function IsUnique(
  entity: Function,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [entity, property],
      validator: IsUniqueConstraint,
    });
  };
}
