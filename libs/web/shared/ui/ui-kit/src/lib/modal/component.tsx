import {
  Modal as NextUIModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps as NextUIModalProps,
  ModalVariantProps,
} from '@heroui/react';
import { FormEventHandler, ReactElement, ReactNode } from 'react';
import Button from '../button/component';
import Icon from '../icon/component';

export interface ModalProps extends ModalVariantProps, NextUIModalProps {
  footerContent?: ReactNode;
  title: string;
  onSubmit?: FormEventHandler<HTMLDivElement>;
}

export function Modal({
  onOpenChange,
  children,
  footerContent,
  title,
  placement = 'center',
  scrollBehavior = 'inside',
  onSubmit,
  ...restProps
}: ModalProps): ReactElement {
  return (
    <NextUIModal
      placement={placement}
      scrollBehavior={scrollBehavior}
      closeButton={
        <Button
          color='default'
          isIconOnly
          radius='full'>
          <Icon name='cross' />
        </Button>
      }
      {...restProps}
      classNames={{
        ...restProps.classNames,
        closeButton: 'top-6 right-6',
      }}>
      <ModalContent
        onSubmit={onSubmit}
        as={onSubmit ? 'form' : undefined}
        className='p-6'>
        <ModalHeader className='text-center text-2xl justify-center p-0 mb-6'>{title}</ModalHeader>
        <ModalBody className='p-0 mb-6'>{children}</ModalBody>
        {!!footerContent && <ModalFooter className='p-0 gap-2.5'>{footerContent}</ModalFooter>}
      </ModalContent>
    </NextUIModal>
  );
}
