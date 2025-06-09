import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import { SortOptions } from './SortOptions';

const onChangeMock = vi.fn<(sort: string) => void>();

describe('sort options component', () => {
  it('should render sort options', () => {
    expect.hasAssertions();

    render(<SortOptions sort="price desc" onChange={onChangeMock} />);

    const select = screen.getByPlaceholderText(/сортировать по/i);

    expect(select).toBeInTheDocument();

    expect(screen.getByText(/подешевле/i)).toBeInTheDocument();
    expect(screen.getByText(/подороже/i)).toBeInTheDocument();
    expect(screen.getByText(/по имени/i)).toBeInTheDocument();
  });

  it('should render selected value', () => {
    expect.hasAssertions();

    render(<SortOptions sort="price desc" onChange={onChangeMock} />);

    const select = screen.getByPlaceholderText(/сортировать по/i);

    expect(select).toHaveValue('Подороже');
  });

  it('should call onChange on select sort', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<SortOptions sort="price desc" onChange={onChangeMock} />);

    const select = screen.getByPlaceholderText(/сортировать по/i);

    await user.click(select);
    await user.click(screen.getByText('Подешевле'));

    expect(onChangeMock).toHaveBeenCalledWith('price asc');
  });
});
