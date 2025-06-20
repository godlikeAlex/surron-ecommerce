import { Text, Container, Title, Button, Box } from '@mantine/core';
import classes from './HeroSection.module.scss';
import { Link } from 'react-router';

export const HeroSection = () => {
  return (
    <Box className={classes.heroSection}>
      <Container className={classes.heroSectionContent} size="xl">
        <Title order={2}>
          Максимальная скорость и полный контроль в твоих руках.
        </Title>
        <Title order={2}>
          Скидка — до 20%{' '}
          <span style={{ color: '#FAB007' }}>только сегодня.</span>
        </Title>
        <Text mt={'xs'} style={{ maxWidth: '50%' }} opacity={0.8}>
          Легкий, мощный, бесшумный — твой байк готов к любому маршруту. И
          сейчас ты можешь получить его по лучшей цене года. Осталось лишь
          нажать на газ.
        </Text>
        <Button component={Link} to={'/catalog'} mt={'lg'} color="yellow">
          Забрать свой байк
        </Button>
      </Container>
    </Box>
  );
};
