# TS React Blog
Сайт блог, разработанный с помощью следующих технологий:
1. Node.js;
2. TypeScript;
3. Express;
4. TypeORM;
5. PostgreSQL;
6. Argon2;
7. React.


## Функционал
Все пользователи разделяются на несколько групп:
1. Гости (незарегистрированные пользователи);
2. Пользователи (зарегистрированные пользователи);
3. Модераторы;
4. Администраторы.

### Функционал для роли "Гость"
Гость может:
1. Зарегистрироваться;
2. Смотреть публикации других пользователей;
3. Смотреть комментарии к публикациям;
4. Фильтровать и искать публикации.

### Функционал для роли "Пользователь"
Пользователь может то же, что и "Гость". Кроме того есть возможности:
1. Авторизоваться;
2. Писать комментарии к публикациям;
3. Изменять персональные данные в личном кабинете;
4. Добавлять публикации;
5. Изменять свои публикации;
6. Удалять свои публикации.

### Функционал для роли "Модератор"
Модераторы имеют доступ ко всем публикациям и комментариям к ним. Модераторы могут удалять публикации и комментарии. При этом необходимо указать причину, по которой они были удалены.

### Функционал для роли "Администратор"
Администраторы имеют полный доступ ко всему контенту на сайте, в том числе и к пользователям. Т.е. администратор может делать пользователей модераторами, например.
