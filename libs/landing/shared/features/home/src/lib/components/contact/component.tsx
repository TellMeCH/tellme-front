import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import { Button, Textarea, TextInput } from '@tellme/shared/ui/ui-kit';
import { HomeSectionId } from '../../enums';

const mailchimpActionUrl =
  'https://tell-me.us2.list-manage.com/subscribe/post?u=c4f987d41ec44f05821236f9e&amp;id=8644ec6302&amp;f_id=006570e1f0';

export function Contact(): ReactElement {
  const t = useTranslations('landing-shared.HOME.CONTACT');

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
          className='flex-1 flex flex-col gap-3'
          action={mailchimpActionUrl}
          method='post'
          id='mc-embedded-subscribe-form'
          name='mc-embedded-subscribe-form'>
          <TextInput
            inputColor='transparent'
            inputSize='big'
            label={t('TEXT_NAME')}
            placeholder='John Doe'
            type='text'
            name='NAME'
            id='mce-NAME'
            required
            autoComplete='name'
            max={255}
          />
          <TextInput
            inputColor='transparent'
            inputSize='big'
            label={t('TEXT_EMAIL')}
            placeholder='john@gmail.com'
            type='email'
            name='EMAIL'
            id='mce-EMAIL'
            required
            autoComplete='email'
          />
          <TextInput
            inputColor='transparent'
            inputSize='big'
            label={t('TEXT_PHONE')}
            placeholder='+56787239820'
            type='text'
            name='PHONE'
            id='mce-PHONE'
            required
          />
          <TextInput
            inputColor='transparent'
            inputSize='big'
            label={t('TEXT_COMPANY')}
            placeholder='Arte.co'
            type='text'
            name='COMPANY'
            id='mce-COMPANY'
            required
            max={255}
          />
          <TextInput
            inputColor='transparent'
            inputSize='big'
            label={t('TEXT_CALL_CENTER_SIZE')}
            placeholder={t('TEXT_AGENTS')}
            type='number'
            name='CC_SIZE'
            id='mce-CC_SIZE'
            required
          />
          <Textarea
            inputColor='transparent'
            label={t('TEXT_MESSAGE')}
            placeholder={t('TEXT_TYPE_HERE')}
            name='MESSAGE'
            id='mce-MESSAGE'
            required
            className='mt-3'
            minRows={6}
            max={255}
          />
          <Button
            color='secondary'
            type='submit'
            name='subscribe'
            id='mc-embedded-subscribe'
            size='lg'
            className='mt-6'
            fullWidth>
            {t('BUTTON_SEND_MESSAGE')}
          </Button>
        </form>
      </div>
    </section>
  );
}
