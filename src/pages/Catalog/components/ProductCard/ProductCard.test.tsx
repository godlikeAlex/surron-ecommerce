import { describe, expect, it } from 'vitest';
import { render, screen } from '@/tests/utils';
import { ProductCard } from './ProductCard';
import { Price } from '@commercetools/platform-sdk';

const basicPriceMock: Price = {
  id: '',
  value: {
    type: 'centPrecision',
    centAmount: 10000,
    currencyCode: 'RUB',
    fractionDigits: 100,
  },
  discounted: undefined,
};

const priceWithDiscountMock: Price = {
  id: '',
  value: {
    type: 'centPrecision',
    centAmount: 10000,
    currencyCode: 'RUB',
    fractionDigits: 100,
  },
  discounted: {
    value: {
      type: 'centPrecision',
      centAmount: 5000,
      currencyCode: 'RUB',
      fractionDigits: 100,
    },
    discount: { typeId: 'product-discount', id: '' },
  },
};

const productCardPropsMock = {
  id: '1',
  name: { ru: 'Surron Bike' },
  description: { ru: 'Example Description' },
  productKey: 'surron-bike',
  masterVariant: {
    id: 999,
    prices: [basicPriceMock],
    images: [{ url: 'https://example.com', dimensions: { w: 120, h: 120 } }],
  },
  variants: [],
};

describe('product card component', () => {
  it('should render basic product card', () => {
    expect.hasAssertions();

    render(<ProductCard {...productCardPropsMock} />);

    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(
      screen.getByRole('img', { name: productCardPropsMock.name.ru })
    ).toBeInTheDocument();
    expect(screen.getByText(productCardPropsMock.name.ru)).toBeInTheDocument();
    expect(
      screen.getByText(productCardPropsMock.description.ru)
    ).toBeInTheDocument();
  });

  it('should render basic price', () => {
    expect.hasAssertions();

    render(<ProductCard {...productCardPropsMock} />);

    const basePrice = screen.getByTestId('base-price');

    expect(basePrice).toBeInTheDocument();
    expect(basePrice).not.toHaveStyle({ textDecoration: 'line-through' });
  });

  it('should render discounted price', () => {
    expect.hasAssertions();

    render(
      <ProductCard
        {...{
          ...productCardPropsMock,
          masterVariant: {
            ...productCardPropsMock.masterVariant,
            prices: [priceWithDiscountMock],
          },
        }}
      />
    );

    const discountedPriceValue =
      priceWithDiscountMock.discounted?.value.centAmount ?? 1;

    const basePrice = screen.getByTestId('base-price');

    const discountedPrice = screen.getByText(`${discountedPriceValue / 100} ₽`);

    expect(basePrice).toBeInTheDocument();
    expect(basePrice).toHaveStyle({ textDecoration: 'line-through' });

    expect(discountedPrice).toBeInTheDocument();
  });
});
