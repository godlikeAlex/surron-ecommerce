import { describe, expect, it } from 'vitest';
import { render, screen, userEvent } from '@/tests/utils';
import { TreeCategoryLink } from './TreeCategoryLink';

const singleCategoryMock = {
  id: '1',
  name: 'Surron',
  slug: 'surron-category',
  isActive: false,
  children: [],
};

const categoryWithChildrenMock = {
  ...singleCategoryMock,
  children: [
    {
      id: '2',
      name: 'Surron Hyper BEE',
      slug: 'surron-hyper-bee',
      isActive: false,
      children: [],
    },
    {
      id: '3',
      name: 'Surron Hyper ULTRA',
      slug: 'surron-hyper-ultra',
      isActive: false,
      children: [],
    },
  ],
};

describe('tree category component', () => {
  it('should render single link', () => {
    expect.hasAssertions();

    render(<TreeCategoryLink category={singleCategoryMock} />);

    const singleLink = screen.getByRole('link', {
      name: singleCategoryMock.name,
    });

    expect(singleLink).toBeInTheDocument();
    expect(singleLink).toHaveAttribute(
      'href',
      `/catalog/${singleCategoryMock.slug}`
    );
  });

  it('should render links with children', () => {
    expect.hasAssertions();

    render(<TreeCategoryLink category={categoryWithChildrenMock} />);

    const allLinks = screen.getAllByRole('link', { hidden: true });

    categoryWithChildrenMock.children.forEach((category) => {
      const link = allLinks.find(
        (link) =>
          link.getAttribute('href') ===
          `/catalog/${singleCategoryMock.slug}/${category.slug}`
      );

      expect(link).toBeInTheDocument();
    });
  });

  it('should show nested links on click exapnd icon', async () => {
    expect.hasAssertions();

    const user = userEvent.setup();

    render(<TreeCategoryLink category={categoryWithChildrenMock} />);

    expect(screen.getAllByRole('link', { hidden: false })).toHaveLength(1);

    const expandButton = screen.getByRole('button', {
      name: 'Раскрыть категории',
    });

    await user.click(expandButton);

    expect(screen.getAllByRole('link', { hidden: false })).toHaveLength(3);
  });
});
