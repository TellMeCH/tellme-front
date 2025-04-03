import { ReactElement } from 'react';
import { ToastContainer as ToastifyToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ToastContainer = (): ReactElement => {
  return <ToastifyToastContainer hideProgressBar />;
};
