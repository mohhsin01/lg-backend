import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    const [EntityClass, property] = args.constraints;

    const repository = this.dataSource.getRepository(EntityClass);

    const existing = await repository.findOne({ where: { [property]: value } });

    return !existing; //it will return true if value is not found in the DB
  }

  defaultMessage(args: ValidationArguments) {
    const [User, property] = args.constraints;
    //if we want to ignore the first constraint which is the entity class
    //const [_, property] = args.constraints;
    return `${property} "${args.value}" already exists.`;
  }
}
