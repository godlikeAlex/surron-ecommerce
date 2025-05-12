import { render as testingLibraryRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { MemoryRouter } from 'react-router';

export const render = (ui: React.ReactNode) => {
  return testingLibraryRender(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </MemoryRouter>
    ),
  });
};
