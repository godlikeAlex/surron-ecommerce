import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/tests/utils';
import { DebounceSearch } from './DebounceSearch';

const onSearchMock = vi.fn<(searchTerm: string) => void>();

describe('debounce search component', () => {
  it('should render input', () => {
    expect.hasAssertions();

    render(<DebounceSearch defaultValue="" onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText('Найти товары');

    expect(searchInput).toBeInTheDocument();
  });

  it('should render input with correct value', () => {
    expect.hasAssertions();

    const value = 'Surron Bike';

    render(<DebounceSearch defaultValue={value} onSearch={onSearchMock} />);

    const searchInput = screen.getByDisplayValue(value);

    expect(searchInput).toBeInTheDocument();
  });

  it('should call onSearch callback with debounce', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<DebounceSearch defaultValue={''} onSearch={onSearchMock} />);

    const searchInput = screen.getByPlaceholderText('Найти товары');

    await user.type(searchInput, 'Surron');

    expect(onSearchMock).not.toHaveBeenCalled();

    await waitFor(
      () => {
        expect(onSearchMock).toHaveBeenCalledWith('Surron');
      },
      { timeout: 900 }
    );
  });
});
