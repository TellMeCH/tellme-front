import { Exclude, Expose } from 'class-transformer';
import { EmployeeAuthType } from '../enums';

export class EmployeeUser {
  @Expose()
  public email: string;

  @Expose({ name: 'auth_type' })
  public authType: EmployeeAuthType;

  @Expose({ name: 'first_name' })
  public firstName: string;

  @Expose({ name: 'last_name' })
  public lastName: string;

  @Exclude()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  constructor(model: Partial<EmployeeUser>) {
    Object.assign(this, model);
  }
}
