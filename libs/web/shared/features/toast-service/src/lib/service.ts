import { ToastType } from './enums';
import { showToast } from './utils/show-toast';

export class ToastService {
  public static showSuccess(content: string): void {
    showToast(content, { type: ToastType.SUCCESS });
  }

  public static showError(content: string): void {
    showToast(content, { type: ToastType.ERROR });
  }

  public static showWarning(content: string): void {
    showToast(content, { type: ToastType.WARNING });
  }

  public static showInfo(content: string): void {
    showToast(content, { type: ToastType.INFO });
  }
}
