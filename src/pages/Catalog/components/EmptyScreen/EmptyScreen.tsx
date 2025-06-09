import { Button, Container, Image, Text, Title } from '@mantine/core';
import EmptyImage from '@/assets/empty-image.png';
import classes from './EmptyScreen.module.scss';

type Props = {
  onResetFilters: () => void;
};

export const EmptyScreen = ({ onResetFilters }: Props) => (
  <Container className={classes.container}>
    <Image
      src={EmptyImage}
      className={classes.image}
      w={360}
      alt="Ничего не найдено"
    />

    <Title order={2}>Упс! Ничего не найдено</Title>

    <Text mt="xs" c="dimmed">
      Похоже, ничего не соответствует вашему запросу.
    </Text>
    <Text c="dimmed">
      Сбросьте фильтры или попробуйте другой поиск — возможно, так вы найдёте
      то, что нужно.
    </Text>

    <Button mt="md" onClick={onResetFilters} color="red">
      Сбросить фильтры
    </Button>
  </Container>
);
