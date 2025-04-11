import { Expose } from 'class-transformer';
import { BaseEntity } from '../../common';

export class Organization extends BaseEntity {
  @Expose()
  public name: string;

  @Expose({ name: 'conversation_count' })
  public conversationsCount: number;

  @Expose({ name: 'max_user_count' })
  public maxUsersCount: number;

  @Expose({ name: 'employee_count' })
  public employeesCount: number;

  constructor(model: Partial<Organization>) {
    super(model);
    Object.assign(this, model);
  }
}
