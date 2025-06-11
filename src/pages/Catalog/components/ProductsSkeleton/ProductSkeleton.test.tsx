import { describe, expect, it } from 'vitest';
import { render, screen } from '@/tests/utils';
import { ProductsSkeleton } from './ProductsSkeleton';

describe('product skeleton component', () => {
  it('should render', () => {
    expect.hasAssertions();

    render(<ProductsSkeleton />);

    const skeletons = screen.getAllByRole('presentation');

    expect(screen.getByRole('separator')).toBeInTheDocument();

    expect(skeletons).toHaveLength(7);
  });
});
