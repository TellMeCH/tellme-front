import { screen, waitFor } from '@testing-library/react';

export async function getByTestIdAsync(testId: string): Promise<HTMLElement> {
  let result: HTMLElement;
  await waitFor(() => {
    result = screen.getByTestId(testId);
  });

  return result!;
}
