'use client';

import { ReactElement } from 'react';
import { ToastContainer as ToastifyToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CloseButton } from './components';

export const ToastContainer = (): ReactElement => {
  return <ToastifyToastContainer hideProgressBar closeButton={CloseButton} />;
};
