import { describe, expect, it } from 'vitest';
import { render, screen } from '@/tests/utils';
import { SidebarSection } from './SidebarSection';

describe.todo('sidebar filters component');

describe('sidebar section component', () => {
  it('should render correct with title', () => {
    expect.hasAssertions();

    const title = 'Example title';

    render(
      <SidebarSection title={title}>
        <h1>Hello world</h1>
      </SidebarSection>
    );

    expect(
      screen.getByRole('heading', { level: 5, name: title })
    ).toBeInTheDocument();
  });

  it('should render without title if title not present', () => {
    expect.hasAssertions();

    render(
      <SidebarSection>
        <h1>Hello world</h1>
      </SidebarSection>
    );

    expect(screen.queryByRole('heading', { level: 5 })).not.toBeInTheDocument();
  });

  it('should render with correct children', () => {
    expect.hasAssertions();

    render(
      <SidebarSection>
        <h1>Hello world</h1>
      </SidebarSection>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'Hello world' })
    ).toBeInTheDocument();
  });

  it('should render sidebar section skeleton and children', () => {
    expect.hasAssertions();

    render(
      <SidebarSection.Skeleton>
        <h1>Hello world</h1>
      </SidebarSection.Skeleton>
    );

    expect(screen.getAllByRole('presentation')).toHaveLength(1);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Hello world' })
    ).toBeInTheDocument();
  });
});
