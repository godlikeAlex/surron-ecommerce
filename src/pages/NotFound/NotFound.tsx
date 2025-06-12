import {
  Container,
  SimpleGrid,
  Image,
  Title,
  Text,
  Button,
  Flex,
} from '@mantine/core';
import notFoundImage from '@/assets/404.webp';
import { Link } from 'react-router';
import classes from './NotFoundImage.module.scss';

const NotFound = () => {
  return (
    <Container className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2 }}>
        <Flex
          direction={'column'}
          align={{ sm: 'start', xs: 'center' }}
          justify={'center'}
        >
          <Title>Страница не найдена</Title>
          <Text mt="md">
            Страница, которую вы пытаетесь открыть, не существует. Возможно, вы
            неправильно набрали адрес, или страница была перемещена на другой
            URL.
          </Text>

          <Button component={Link} to="/" variant="outline" mt="md">
            Главная страница
          </Button>
        </Flex>
        <Image src={notFoundImage} className={classes.notfoundImage} />
      </SimpleGrid>
    </Container>
  );
};

export default NotFound;
