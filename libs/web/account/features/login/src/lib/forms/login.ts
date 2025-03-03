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

  public static get validationSchema(): Yup.ObjectSchema<FormValues<LoginFormSchema>> {
    return Yup.object().shape({
      email: Yup.string().required().email(),
      password: Yup.string().required(),
    });
  }

  constructor() {
    this.email = '';
    this.password = '';
  }
}
