import { useTranslations } from 'next-intl';
import { Fragment, ReactElement, ReactNode } from 'react';
import Button from '../button/component';
import { Modal } from '../modal/component';

interface ConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  confirmationButtonText: string;
  isLoading?: boolean;
}

export function ConfirmationModal({
  title,
  description,
  onConfirm,
  confirmationButtonText,
  isOpen,
  onOpenChange,
  isLoading,
}: ConfirmationModalProps): ReactElement {
  const t = useTranslations('web-shared.UI_KIT.CONFIRMATION_MODAL');

  return (
    <Modal
      size='lg'
      isOpen={isOpen}
      onClose={onOpenChange}
      title={title}
      footerContent={
        <Fragment>
          <Button
            variant='light'
            onPress={onOpenChange}
            isDisabled={isLoading}
            className='flex-1'>
            {t('BUTTON_CANCEL')}
          </Button>
          <Button
            color='danger'
            onPress={onConfirm}
            isLoading={isLoading}
            className='flex-1'>
            {confirmationButtonText}
          </Button>
        </Fragment>
      }>
      <div className='text-center mb-11'>{description}</div>
    </Modal>
  );
}
