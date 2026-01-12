import * as Yup from 'yup';
import { EmployeeAuthType, EmployeeRole, EmployeeUser } from '@tellme/web/shared/data-access/api';
import { BaseFormSchema, FormValues } from '@tellme/web/shared/utils/form';

export class EmployeeFormSchema implements BaseFormSchema<EmployeeFormSchema> {
  public user: Omit<EmployeeUser, 'fullName'>;
  public role: EmployeeRole;
  public isOrganizationAdmin: boolean;

  public get formValues(): FormValues<EmployeeFormSchema> {
    return {
      user: this.user,
      role: this.role,
      isOrganizationAdmin: this.isOrganizationAdmin,
    };
  }

  constructor() {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      authType: EmployeeAuthType.PASSWORD,
    };
    this.role = EmployeeRole.AGENT;
    this.isOrganizationAdmin = false;
  }

  public static validationSchema(
    t: (key: string) => string | undefined,
  ): Yup.ObjectSchema<FormValues<EmployeeFormSchema>> {
    return Yup.object().shape({
      user: Yup.object().shape({
        firstName: Yup.string().required(t('TEXT_REQUIRED_FIRST_NAME')),
        lastName: Yup.string().required(t('TEXT_REQUIRED_LAST_NAME')),
        email: Yup.string().required(t('TEXT_REQUIRED_EMAIL')).email(t('TEXT_INVALID_EMAIL')),
        authType: Yup.mixed<EmployeeAuthType>().oneOf(Object.values(EmployeeAuthType)).required(),
      }),
      role: Yup.mixed<EmployeeRole>().oneOf(Object.values(EmployeeRole)).required(),
      isOrganizationAdmin: Yup.boolean().required(),
    });
  }
}
