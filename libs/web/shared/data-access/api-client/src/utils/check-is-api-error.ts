export function checkIsApiError(error: unknown): boolean {
  return typeof error === 'object' && error != null && 'code' in error && !isNaN(Number(error.code));
}
