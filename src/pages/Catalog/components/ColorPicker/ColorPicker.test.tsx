import { describe, expect, it, vi } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import { ColorPicker } from './ColorPicker';

const colors = ['red', 'green', 'pink'];
const onChangeColorFnMock = vi.fn<(colors: string[]) => void>();

describe('color picker compoent', () => {
  it('should render corect colors', () => {
    expect.hasAssertions();

    render(
      <ColorPicker
        selectedColors={[]}
        onChange={onChangeColorFnMock}
        colors={colors}
      />
    );

    colors.forEach((color) => {
      expect(screen.getByRole('button', { name: color })).toBeInTheDocument();
    });
  });

  it('should render selected colors', () => {
    expect.hasAssertions();

    const selectedColors = colors.slice(1);

    render(
      <ColorPicker
        selectedColors={selectedColors}
        colors={colors}
        onChange={onChangeColorFnMock}
      />
    );

    selectedColors.forEach((color) => {
      expect(
        screen.getByRole('button', { name: color, pressed: true })
      ).toBeInTheDocument();
    });
  });

  it('should call onChange handler with clicked colors', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(
      <ColorPicker
        selectedColors={[]}
        colors={colors}
        onChange={onChangeColorFnMock}
      />
    );

    const [clickedColor] = colors;

    const button = screen.getByRole('button', { name: clickedColor });

    await user.click(button);

    expect(onChangeColorFnMock).toHaveBeenCalledWith([clickedColor]);
  });
});

describe('color picker skeleton component', () => {
  it('should render 6 skeleton colors', () => {
    expect.hasAssertions();

    render(<ColorPicker.Skeleton />);

    const skeletons = screen.getAllByRole('presentation');

    expect(skeletons).toHaveLength(6);
  });
});
