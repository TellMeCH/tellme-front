import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import { TextInput } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';

const mailchimpActionUrl =
  'https://docky.us21.list-manage.com/subscribe/post?u=2473c54b3fbed6461cf7c9b2e&amp;id=5a6cf4994e&amp;f_id=00aef1e6f0';

export function Contact(): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <section className='section text-background-primary bg-text-primary' id={HomeSectionId.CONTACT_US}>
      <div className='container pt-[3.75rem] max-lg:pt-0 flex gap-[12%] max-md:flex-col max-md:gap-2.5'>
        <div className='flex-1'>
          <Heading level={2} className='mb-[3.75rem] max-lg:mb-10'>
            {t('TEXT_CONTACT_TITLE')}
          </Heading>
          <p>{t('TEXT_CONTACT_DESCRIPTION')}</p>
        </div>
        <form
          className='flex-1'
          action={mailchimpActionUrl}
          method='post'
          id='mc-embedded-subscribe-form'
          name='mc-embedded-subscribe-form'>
          <div className='mc-field-group'>
            <TextInput
              inputColor='transparent'
              inputSize='big'
              label={t('TEXT_EMAIL')}
              placeholder='john@gmail.com'
              type='email'
              name='EMAIL'
              id='mce-EMAIL'
              required
            />
          </div>
        </form>
      </div>
    </section>
  );
}
