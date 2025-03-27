import { Expose, Type } from 'class-transformer';
import { BaseEntity } from '../../common';
import { EmployeeRole } from '../enums';
import { EmployeeUser } from './user';

export class Employee extends BaseEntity {
  @Expose({ name: 'organization' })
  public organizationUrl: string;

  @Expose()
  @Type(() => EmployeeUser)
  public user: EmployeeUser;

  @Expose()
  public role: EmployeeRole;

  @Expose({ name: 'is_organization_admin' })
  public isOrganizationAdmin: boolean;

  constructor(model: Partial<Employee>) {
    super(model);
    Object.assign(this, model);
  }
}
