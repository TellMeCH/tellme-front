import clsx from 'clsx';
import { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { ToastType } from '../enums';
import styles from './toast.module.scss';

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
    className: clsx(styles.toast, styles[`toast_${type}`]),
  });
};
