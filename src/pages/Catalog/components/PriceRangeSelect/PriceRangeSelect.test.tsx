import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent, waitFor } from '@/tests/utils';
import { PriceRangeSelect } from './PriceRangeSelect';

vi.mock('@mantine/core');

const onChangeFnMock = vi.fn<(values: { from: number; to: number }) => void>();

describe('price range component', () => {
  it('should render inputs and range slider', () => {
    expect.hasAssertions();

    render(
      <PriceRangeSelect
        min={200}
        max={400}
        initialValues={{ from: 210, to: 350 }}
        onChange={onChangeFnMock}
      />
    );

    const minInput = screen.getByPlaceholderText('Минимальная цена');
    const maxInput = screen.getByPlaceholderText('Максимальная цена');

    const [minSlider, maxSlider] = screen.getAllByRole('slider');

    expect(minSlider).toBeInTheDocument();
    expect(maxSlider).toBeInTheDocument();

    expect(minInput).toBeInTheDocument();
    expect(maxInput).toBeInTheDocument();
  });

  it('should render initial values for inputs and slider', () => {
    expect.hasAssertions();

    const from = 210;
    const to = 350;

    render(
      <PriceRangeSelect
        min={200}
        max={400}
        initialValues={{ from, to }}
        onChange={onChangeFnMock}
      />
    );

    const minInput = screen.getByPlaceholderText('Минимальная цена');
    const maxInput = screen.getByPlaceholderText('Максимальная цена');

    const [minSlider, maxSlider] = screen.getAllByRole('slider');

    expect(minInput).toHaveDisplayValue(`₽ ${from}`);
    expect(maxInput).toHaveDisplayValue(`₽ ${to}`);

    expect(minSlider).toHaveAttribute('aria-valuenow', `${from}`);
    expect(maxSlider).toHaveAttribute('aria-valuenow', `${to}`);
  });

  it('should call onChange function when updates min input and max input', async () => {
    expect.hasAssertions();

    const from = 210;
    const to = 350;

    const user = userEvent.setup();

    render(
      <PriceRangeSelect
        min={200}
        max={400}
        initialValues={{ from, to }}
        onChange={onChangeFnMock}
      />
    );

    const minInput = screen.getByPlaceholderText('Минимальная цена');
    const maxInput = screen.getByPlaceholderText('Максимальная цена');

    await user.clear(minInput);
    await user.type(minInput, '220');

    await user.clear(maxInput);
    await user.type(maxInput, '390');

    await waitFor(
      () => {
        expect(onChangeFnMock).toHaveBeenCalledWith({ from: 220, to: 390 });
      },
      { timeout: 800 }
    );
  });

  it('should update min/max sliders on change min/max inputs', async () => {
    expect.hasAssertions();

    const from = 210;
    const to = 350;

    const changedFrom = 220;
    const changedTo = 390;

    const user = userEvent.setup();

    render(
      <PriceRangeSelect
        min={200}
        max={400}
        initialValues={{ from, to }}
        onChange={onChangeFnMock}
      />
    );

    const minInput = screen.getByPlaceholderText('Минимальная цена');
    const maxInput = screen.getByPlaceholderText('Максимальная цена');

    await user.clear(minInput);
    await user.type(minInput, `${changedFrom}`);

    await user.clear(maxInput);
    await user.type(maxInput, `${changedTo}`);

    const [minSlider, maxSlider] = screen.getAllByRole('slider');

    expect(minSlider).toHaveAttribute('aria-valuenow', `${changedFrom}`);
    expect(maxSlider).toHaveAttribute('aria-valuenow', `${changedTo}`);
  });

  it('should update min/max inputs on change min/max sliders', async () => {
    expect.hasAssertions();

    const from = 210;
    const to = 350;

    const changedFrom = 220;
    const changedTo = 390;

    const user = userEvent.setup();

    render(
      <PriceRangeSelect
        min={200}
        max={400}
        initialValues={{ from, to }}
        onChange={onChangeFnMock}
      />
    );

    const [minSlider, maxSlider] = screen.getAllByRole('slider');

    await user.type(minSlider, `${changedFrom}`);
    await user.type(maxSlider, `${changedTo}`);

    expect(screen.getByPlaceholderText('Минимальная цена')).toHaveDisplayValue(
      `₽ ${changedFrom}`
    );
    expect(screen.getByPlaceholderText('Максимальная цена')).toHaveDisplayValue(
      `₽ ${changedTo}`
    );
  });
});

describe('price range skeleton component', () => {
  it('should render 3 skeletons', () => {
    expect.hasAssertions();

    render(<PriceRangeSelect.Skeleton />);

    const skeletons = screen.getAllByRole('presentation');

    expect(skeletons).toHaveLength(3);
  });
});
