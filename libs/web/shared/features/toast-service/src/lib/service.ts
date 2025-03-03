import { ToastType } from './enums';
import { showToast, ToastOptions } from './utils/show-toast';

export class ToastService {
  public static showSuccess(content: string, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.SUCCESS, ...options });
  }

  public static showError(content: string, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.ERROR, ...options });
  }

  public static showWarning(content: string, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.WARNING, ...options });
  }

  public static showInfo(content: string, options: ToastOptions = {}): void {
    showToast(content, { type: ToastType.INFO, ...options });
  }
}
