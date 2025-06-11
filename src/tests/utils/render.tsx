import {
  render as testingLibraryRender,
  renderHook as testingLibraryRenderHook,
} from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MantineProvider>
  </MemoryRouter>
);

export const render = (ui: React.ReactNode) => {
  return testingLibraryRender(<>{ui}</>, {
    wrapper,
  });
};

export const renderHook = <Result, Props>(
  hook: (initialProps: Props) => Result
) => {
  return testingLibraryRenderHook(hook, {
    wrapper,
  });
};
