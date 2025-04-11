import { screen, waitFor } from '@testing-library/react';

export async function getAllByTestIdAsync(testId: string): Promise<Array<HTMLElement>> {
  let result: Array<HTMLElement> = [];
  await waitFor(async () => {
    result = screen.getAllByTestId(testId);
  });

  return result;
}
