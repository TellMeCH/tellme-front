import { Exclude, Expose, Type } from 'class-transformer';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
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

  @Exclude()
  public get organizationId(): number {
    return getIdFromUrl(this.organizationUrl);
  }

  constructor(model: Partial<Employee>) {
    super(model);
    Object.assign(this, model);
  }
}
