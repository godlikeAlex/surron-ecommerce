import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { DatesProvider } from '@mantine/dates';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Notifications } from '@mantine/notifications';

import App from '@/App';
import { theme } from '@/theme';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import 'dayjs/locale/ru';
import './main.scss';
import '@mantine/carousel/styles.css';

export const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="top-right" />
      <DatesProvider settings={{ locale: 'ru' }}>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </DatesProvider>
    </MantineProvider>
  </StrictMode>
);
