// URL example https://tellme-service-716439647851.europe-west6.run.app/api/v1/topics/28/
export function getIdFromUrl(url: string): number {
  const segments = url.split('/');

  return Number(segments[segments.length - 2]);
}
