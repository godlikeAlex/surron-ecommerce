import { describe, expect, it } from 'vitest';
import { render, screen } from '@/tests/utils';
import { BreadcrumbsCategories } from './BreadcrumbsCategories';
import type { Category } from '../../hooks/useCategories';

const categoriesMock: Category[] = [
  {
    id: '1',
    name: 'Surron',
    slug: 'surron',
    isActive: true,
    key: 'surron',
    children: [],
  },
  {
    id: '2',
    name: 'Hyper Bee',
    slug: 'surron',
    isActive: true,
    key: 'surron',
    children: [],
  },
];

describe('breadcrumb categories', () => {
  it('should render default breadcrumbs', () => {
    expect.hasAssertions();

    render(<BreadcrumbsCategories currentCategories={[]} />);

    expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
    expect(screen.getByText('Каталог')).toBeInTheDocument();
  });

  it('should render categories current categories', () => {
    expect.hasAssertions();

    render(<BreadcrumbsCategories currentCategories={categoriesMock} />);

    expect(screen.getByRole('link', { name: 'Главная' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Каталог' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Surron' })).toBeInTheDocument();
    expect(screen.getByText('Hyper Bee')).toBeInTheDocument();
  });

  it('should last breadcrumb render as text', () => {
    expect.hasAssertions();

    render(<BreadcrumbsCategories currentCategories={categoriesMock} />);

    expect(
      screen.queryByRole('link', { name: 'Hyper Bee' })
    ).not.toBeInTheDocument();

    expect(screen.getByText('Hyper Bee')).toBeInTheDocument();
  });

  it('should render 3 breadcrumbs skeleton', () => {
    expect.hasAssertions();

    render(<BreadcrumbsCategories.Skeleton />);

    const skeletons = screen.getAllByRole('presentation');

    expect(skeletons).toHaveLength(3);
  });
});
