import { appConstants } from '@tellme/web/shared/utils/constants';

export function formatCurrency(value: number): string {
  return `${value.toLocaleString('de-CH')} ${appConstants.currencyCode}`;
}
