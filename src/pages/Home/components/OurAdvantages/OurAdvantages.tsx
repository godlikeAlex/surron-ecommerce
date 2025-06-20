import { Box, SimpleGrid, Text, ThemeIcon } from '@mantine/core';
import { BaseSection } from '../BaseSection';
import { IconHelp, IconRefresh, IconTruckDelivery } from '@tabler/icons-react';

const ADVANTAGES = [
  {
    Icon: IconTruckDelivery,
    title: 'Быстрая и надёжная доставка',
    description:
      'Мы отправляем заказы в течение 24 часов после оформления. Работаем с проверенными службами доставки, поэтому вы получите свой товар точно в срок — без задержек и сюрпризов.',
  },
  {
    Icon: IconRefresh,
    title: 'Простой и честный возврат',
    description:
      'Если что-то не подошло — не проблема. Мы принимаем возвраты в течение 14 дней без лишних вопросов. Главное для нас — чтобы вы остались довольны покупкой.',
  },
  {
    Icon: IconHelp,
    title: 'Поддержка на каждом этапе',
    description:
      'Наши менеджеры всегда на связи: поможем подобрать нужный товар, ответим на вопросы и подскажем по доставке. Мы рядом, чтобы покупки были лёгкими и без стресса.',
  },
];

export const OurAdvantages = () => (
  <BaseSection
    title="Наши преимущества"
    description="Делаем всё, чтобы покупки были приятными: от простой оплаты до быстрой доставки и поддержки."
  >
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3 }}
      spacing={{ base: 'xl', md: 50 }}
      verticalSpacing={{ base: 'xl', md: 50 }}
    >
      {ADVANTAGES.map(({ title, description, Icon }) => (
        <Box key={title} style={{ textAlign: 'center' }}>
          <ThemeIcon variant="light" size={80} radius={80} color="yellow">
            <Icon style={{ width: '40%', height: '40%' }} stroke={1.5} />
          </ThemeIcon>
          <Text mt="sm" mb={7}>
            {title}
          </Text>
          <Text size="sm" c="dimmed" lh={1.6}>
            {description}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  </BaseSection>
);
