import * as Yup from 'yup';
import { BaseFormSchema, FormValues } from '@tellme/web/shared/utils/form';

export class LoginFormSchema implements BaseFormSchema<LoginFormSchema> {
  public email: string;
  public password: string;

  public get formValues(): FormValues<LoginFormSchema> {
    return {
      email: this.email,
      password: this.password,
    };
  }

  public static validationSchema(
    t: (key: string) => string | undefined,
  ): Yup.ObjectSchema<FormValues<LoginFormSchema>> {
    return Yup.object().shape({
      email: Yup.string().required(t('TEXT_REQUIRED_EMAIL')).email(t('TEXT_INVALID_EMAIL')),
      password: Yup.string().required(t('TEXT_REQUIRED_PASSWORD')),
    });
  }

  constructor() {
    this.email = '';
    this.password = '';
  }
}
