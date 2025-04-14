import { Expose, Type } from 'class-transformer';
import { ModifiedBaseEntity } from '../../common';
import { EmployeeRole } from '../enums';
import { EmployeeUser } from './user';

export class ModifiedEmployee extends ModifiedBaseEntity {
  @Expose()
  @Type(() => EmployeeUser)
  public user: EmployeeUser;

  @Expose()
  public role: EmployeeRole;

  @Expose({ name: 'is_organization_admin' })
  public isOrganizationAdmin: boolean;

  constructor(model: Partial<ModifiedEmployee>) {
    super(model);
    Object.assign(this, model);
  }
}
