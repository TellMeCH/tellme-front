export function getIdFromUrl(url: string): number {
  const segments = url.split('/');

  return Number(segments[segments.length - 2]);
}
