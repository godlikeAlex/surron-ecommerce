import {
  Grid,
  Card,
  Image,
  Text,
  Title,
  Anchor,
  Container,
  Flex,
  Stack,
  Group,
  Box,
  Divider,
} from '@mantine/core';
import RSLogo from '@/assets/rss-logo.svg';
import sveta from '@/assets/photo/sveta.png';
import alexander from '@/assets/photo/alexander.jpg';
import milena from '@/assets/photo/milena.jpg';
import classes from './About.module.scss';
import { IconBrandGithubFilled } from '@tabler/icons-react';

type TeamMember = {
  id: number;
  name: string;
  city: string;
  role: string;
  bio: string;
  github: string;
  githubUrl: string;
  photoUrl: string;
  contributions: string[];
};

export const About = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Александр Юрковский',
      city: 'Оренбург',
      role: 'Team Lead, Frontend Developer',
      bio: 'Работаю fullstack-разработчиком в веб-студии, использую React, React Native и Laravel. Занимаюсь созданием сайтов и мобильных приложений для iOS и Android. Решил пройти курс в RS School, чтобы подтянуть свои знания и подготовиться к смене работы.',
      github: 'godlikeAlex',
      githubUrl: 'https://github.com/godlikeAlex',
      photoUrl: alexander,
      contributions: [
        'Настройка репозитория',
        'Настройка проекта',
        'Страница Регистрации',
        'Страница Магазина',
      ],
    },
    {
      id: 2,
      name: 'Светлана Арзамасцева',
      city: 'Самара',
      role: 'Frontend Developer',
      bio: 'В RS School учусь с июля 2024, с середины нулевого стейджа. Когда-то в университете занималась олимпиадным программированием, с тех пор очень люблю решать всякие алгоритмические задачки. До сих пор не знаю, чем сурроны отличаются от мотоциклов.',
      github: 'Lorenzo-StJohn',
      githubUrl: 'https://github.com/Lorenzo-StJohn',
      photoUrl: sveta,
      contributions: [
        'Описание README файла',
        'Скрипты разработки',
        'Роутинг',
        'Настройка apiRootClient',
        'Редактирование профиля',
        'Корзина',
      ],
    },
    {
      id: 3,
      name: 'Милена Белянова',
      city: 'Самара',
      role: 'Frontend Developer',
      bio: 'В IT достаточно давно. Работала тестировщиком в EPAM 5 лет. Затем переквалифицировалась в разработчика после прохождения курсов в RSSchool в 22 году. Опыт работы разработчика Angular - 1 год. Сейчас нахожусь в декретном отпуске. Учусь на курсе, чтобы углубить свои знания и не растерять имеющиеся=)',
      github: 'Milena-Belianova',
      githubUrl: 'https://github.com/Milena-Belianova',
      photoUrl: milena,
      contributions: [
        'Настройка доски задач Youtrack',
        'Настройка CommerceTools',
        'Страница авторизации',
        'Страница товара',
        'Страница О нас',
      ],
    },
  ];

  const collaborationDescription = `
Благодаря ежедневной коммуникации и четкому распределению задач, мы смогли оперативно 
решать возникающие вопросы и поддерживать высокий темп разработки. Наш подход к взаимодействию включал не только 
технические аспекты, но и создание комфортной рабочей атмосферы, что особенно важно в удаленном формате работы.
`;

  const collaborationMethods = [
    {
      method: 'Ежедневная переписка в Telegram',
      impact:
        'Позволила оперативно решать текущие вопросы и синхронизировать работу',
    },
    {
      method: 'Еженедельные созвоны в Discord с ментором',
      impact:
        'Обеспечили стратегическое планирование и получение ценных рекомендаций',
    },
    {
      method: 'Использование Git Flow для контроля версий',
      impact:
        'Гарантировало стабильность кодовой базы и минимизировало конфликты',
    },
    {
      method: 'Проведение код-ревью',
      impact:
        'Повысило качество кода и способствовало обмену знаниями в команде',
    },
    {
      method: 'Планирование задач на доске Youtrack',
      impact:
        'Обеспечило прозрачность процесса разработки и четкое распределение задач',
    },
  ];

  return (
    <Container size="lg" className={classes.container}>
      <Title order={1} ta="center" c="yellow" pt="1.5rem" pb="1rem">
        Наша команда разработчиков
      </Title>

      <Text size="lg" ta="center" c="gray.7" pb="3rem">
        Познакомьтесь с людьми, которые создали этот продукт
      </Text>

      <Grid gutter="xl">
        {teamMembers.map((member) => (
          <Grid.Col key={member.id} span={{ sm: 6, md: 4 }}>
            <Card shadow="sm" padding="lg" className={classes.memberCard}>
              <Card.Section>
                <Image
                  src={member.photoUrl}
                  height={300}
                  alt={`Фото ${member.name}`}
                  className={classes.memberPhoto}
                />
              </Card.Section>

              <Stack gap={0} justify="center" align="center">
                <Title order={3}>{member.name}</Title>

                <Text fw={500} c="yellow">
                  {member.city}
                </Text>

                <Text fw={500} c="dimmed">
                  {member.role}
                </Text>
              </Stack>

              <Text size="sm" className={classes.memberBio}>
                {member.bio}
              </Text>

              <div className={classes.contributions}>
                <Text fw={500} mb="0.5rem">
                  Вклад:
                </Text>
                <ul>
                  {member.contributions.map((contribution, index) => (
                    <li key={index}>{contribution}</li>
                  ))}
                </ul>
              </div>

              <Flex justify="center" align="center" gap="xs">
                <IconBrandGithubFilled size={18} />
                <Anchor href={member.githubUrl} target="_blank" c="black">
                  {member.github}
                </Anchor>
              </Flex>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <div className={classes.collaborationSection}>
        <Title order={2} ta="center" c="yellow" mb="1.5rem">
          Наше взаимодействие
        </Title>

        <Text size="lg" mb="xl" lh={1.7}>
          {collaborationDescription}
        </Text>

        <Title order={3} ta="center" mb="lg">
          Методы работы и их результаты
        </Title>

        <ul className={classes.collaborationList}>
          {collaborationMethods.map((item, index) => (
            <li key={index}>
              <Text fw={600} component="span">
                {item.method}:
              </Text>
              <Text component="span" pl="0.5rem">
                {item.impact}
              </Text>
            </li>
          ))}
        </ul>

        <Text
          size="lg"
          mt="xl"
          c="gray.7"
          pl="1rem"
          className={classes.conclusionText}
        >
          Благодаря такому подходу к организации работы, нам удалось не только
          выполнить все поставленные задачи, но и создать продукт, который
          превзошел ожидания. Каждый член команды внес ценный вклад, а слаженное
          взаимодействие позволило превратить наши сильные стороны в
          замечательный проект.
        </Text>
      </div>

      <Box>
        <Divider my="sm" className={classes.topDivider} />

        <Flex direction="column" align="center" gap="xs" my="xl">
          <Anchor
            href="https://rs.school/"
            target="_blank"
            className={classes.logoLink}
          >
            <Group align="center" gap="xs">
              <img src={RSLogo} alt="RS School Logo" className={classes.logo} />
              <Text size="25px" fw={700} className={classes.logoText}>
                RS School
              </Text>
            </Group>
          </Anchor>
          <Text size="md" c="dimmed" className={classes.courseText}>
            Проект выполнен в рамках прохождения курса{' '}
            <Anchor
              href="https://rs.school/courses/javascript-ru"
              target="_blank"
            >
              JS/Front-end RU Course
            </Anchor>{' '}
            в школе RS School
          </Text>
        </Flex>
        <Divider my="sm" className={classes.bottomDivider} />
      </Box>
    </Container>
  );
};
