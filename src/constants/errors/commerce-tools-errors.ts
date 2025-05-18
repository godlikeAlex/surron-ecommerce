type Error = {
  field?: string;
};

export const COMMERCE_TOOLS_ERRORS: Record<string, (error?: Error) => string> =
  {
    DuplicateField: ({ field = 'поле' } = {}) => {
      if (field === 'email') {
        return 'Уже существует клиент с таким адресом электронной почты.';
      }

      return `Значение для поля "${field}" уже используется`;
    },

    AuthenticationError: () =>
      'Ошибка аутентификации. Проверьте учетные данные',
    AuthorizationError: () => 'Доступ запрещен. Недостаточно прав',

    ResourceNotFound: () => 'Ресурс не найден',
    General: () => 'Внутренняя ошибка сервера. Попробуйте позже',
    BadGateway: () => 'Ошибка шлюза. Попробуйте позже',
  };
