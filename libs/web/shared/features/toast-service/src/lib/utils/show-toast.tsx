import { ReactNode } from 'react';
import { toast } from 'react-toastify';
import styles from '../component.module.scss';
import { ToastType } from '../enums';

export type ToastOptions = {
  autoClose?: false | number;
  type?: ToastType;
};

export const showToast = (message: ReactNode, options: ToastOptions = {}): void => {
  const { type, autoClose = 3000 } = options;

  toast(message, {
    type,
    autoClose,
    position: 'top-right',
    className: styles.toastmessage,
  });
};
