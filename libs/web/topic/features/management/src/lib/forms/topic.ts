import { TranslationValues } from 'next-intl';
import * as Yup from 'yup';
import { BaseFormSchema, FormValues } from '@tellme/web/shared/utils/form';

export class TopicFormSchema implements BaseFormSchema<TopicFormSchema> {
  public isActive: boolean;
  public name: string;
  public description: string;

  public get formValues(): FormValues<TopicFormSchema> {
    return {
      isActive: this.isActive,
      name: this.name,
      description: this.description,
    };
  }

  public static validationSchema(
    t: (key: string, values?: TranslationValues) => string | undefined,
  ): Yup.ObjectSchema<FormValues<TopicFormSchema>> {
    return Yup.object().shape({
      isActive: Yup.boolean().required(),
      name: Yup.string()
        .required(t('TEXT_REQUIRED_NAME'))
        .max(100, t('TEXT_TOO_LONG_NAME', { maxLength: 100 })),
      description: Yup.string().required(t('TEXT_REQUIRED_DESCRIPTION')),
    });
  }

  constructor(schema?: Partial<TopicFormSchema>) {
    this.isActive = schema?.isActive || false;
    this.name = schema?.name || '';
    this.description = schema?.description || '';
  }
}
