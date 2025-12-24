import { Expose, Type } from 'class-transformer';
import { EmployeeUser } from './user';

export class EmployeeErrorData {
  @Expose()
  @Type(() => EmployeeUser)
  public user: EmployeeUser;

  constructor(model: Partial<EmployeeErrorData>) {
    Object.assign(this, model);
  }
}
