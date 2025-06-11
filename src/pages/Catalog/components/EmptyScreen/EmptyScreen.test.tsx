import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import { EmptyScreen } from './EmptyScreen';

const resetFilterMock = vi.fn<() => void>();

describe('empty screen component', () => {
  it('should render empty screen', () => {
    expect.hasAssertions();

    render(<EmptyScreen onResetFilters={resetFilterMock} />);

    const image = screen.getByRole('img', { name: 'Ничего не найдено' });
    const heading = screen.getByRole('heading', {
      level: 2,
      name: 'Упс! Ничего не найдено',
    });
    const resetFiltersButton = screen.getByRole('button', {
      name: /сбросить фильтры/i,
    });

    expect(heading).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(resetFiltersButton).toBeInTheDocument();
  });

  it('should call onResetFilters onClick button', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<EmptyScreen onResetFilters={resetFilterMock} />);

    const resetFiltersButton = screen.getByRole('button', {
      name: /сбросить фильтры/i,
    });

    await user.click(resetFiltersButton);

    expect(resetFilterMock).toHaveBeenCalledTimes(1);
  });
});
