import { ReactNode } from 'react';
import { ToastType } from './enums';
import { showToast, ToastOptions } from './utils/show-toast';

export class ToastService {
  public static showSuccess(content: ReactNode, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.SUCCESS, ...options });
  }

  public static showError(content: ReactNode, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.ERROR, ...options });
  }

  public static showWarning(content: ReactNode, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.WARNING, ...options });
  }

  public static showInfo(content: ReactNode, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.INFO, ...options });
  }
}
