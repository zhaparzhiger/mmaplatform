# MMA Platform

Платформа для управления данными о бойцах, событиях, боях и рейтингах в смешанных единоборствах (MMA). Реализована с использованием **NestJS**, **TypeORM**, **PostgreSQL** и **GraphQL**.

## Описание проекта
Это приложение предоставляет API для работы с сущностями MMA, такими как весовые категории, бойцы, события, бои и рейтинги. Оно поддерживает полный CRUD (Create, Read, Update, Delete) для всех сущностей и включает логику автоматического обновления рейтингов после завершения боев.

### Основные модули
1. **WeightClass** - управление весовыми категориями.
2. **Fighter** - управление бойцами и их статистикой.
3. **Event** - управление событиями (турнирами).
4. **Fight** - управление боями между бойцами.
5. **Ranking** - управление рейтингами бойцов в весовых категориях.

## Требования
- **Node.js**: v18.x или выше
- **PostgreSQL**: v13.x или выше
- **npm**: v8.x или выше

## Установка

1. **Клонируйте репозиторий**:
   ```bash
   git clone <repository-url>
   cd mma-platform
   ```

2. **Установите зависимости**:
   ```bash
   npm install
   ```

3. **Настройте базу данных**:
   - Создайте базу данных в PostgreSQL:
     ```sql
     CREATE DATABASE mma;
     ```
   - Настройте подключение в `src/app.module.ts`:
     ```typescript
     TypeOrmModule.forRoot({
       type: 'postgres',
       host: 'localhost',
       port: 5432,
       username: 'postgres',
       password: 'your_password',
       database: 'mma',
       entities: [Event, Fight, Fighter, WeightClass, Ranking],
       synchronize: true, // В продакшене рекомендуется выключить
       logging: true,
     }),
     ```

4. **Запустите приложение**:
   ```bash
   npm run start:dev
   ```

Приложение будет доступно по адресу `http://localhost:3000/graphql`.

## Структура проекта
```
mma-platform/
├── src/
│   ├── dto/                # DTO для валидации входных данных
│   ├── entities/          # Сущности TypeORM
│   ├── event/            # Модуль событий
│   ├── fight/            # Модуль боев
│   ├── fighter/          # Модуль бойцов
│   ├── ranking/          # Модуль рейтингов
│   ├── weight-class/     # Модуль весовых категорий
│   ├── app.module.ts     # Главный модуль приложения
│   ├── main.ts           # Точка входа
│   └── schema.gql        # Автогенерируемая GraphQL-схема
├── package.json
└── README.md             # Этот файл
```

## ERD
Диаграмма сущностей и связей доступна в `docs/erd.png`.

## SQL Statements
SQL-запросы для создания таблиц находятся в `docs/database.sql`.

## GraphQL API
API доступно через GraphQL Playground по адресу `http://localhost:3000/graphql`. Ниже приведены примеры запросов и мутаций для каждой сущности.

### 1. WeightClass (Весовые категории)

#### Создать весовую категорию
```graphql
mutation {
  createWeightClass(data: { 
    name: "Lightweight", 
    minWeight: 70.3, 
    maxWeight: 77.1 
  }) {
    id
    name
    minWeight
    maxWeight
    createdAt
  }
}
```

#### Получить все весовые категории
```graphql
query {
  weightClasses {
    id
    name
    minWeight
    maxWeight
  }
}
```

### 2. Fighter (Бойцы)

#### Создать бойца
```graphql
mutation {
  createFighter(data: { 
    firstName: "Conor", 
    lastName: "McGregor", 
    weightClassId: 1, 
    nickname: "The Notorious" 
  }) {
    id
    firstName
    lastName
    nickname
    weightClassId
  }
}
```

#### Получить всех бойцов
```graphql
query {
  fighters {
    id
    firstName
    lastName
    nickname
    wins
    losses
    weightClassId
  }
}
```

### 3. Event (События)

#### Создать событие
```graphql
mutation {
  createEvent(data: { 
    name: "UFC 300", 
    date: "2025-04-15", 
    location: "Las Vegas" 
  }) {
    id
    name
    date
    location
  }
}
```

#### Получить все события
```graphql
query {
  events {
    id
    name
    date
    location
  }
}
```

### 4. Fight (Бои)

#### Создать бой
```graphql
mutation {
  createFight(data: {
    eventId: 1
    fighter1Id: 1
    fighter2Id: 2
    winnerId: 1
    method: "KO"
    round: 2
    time: "01:23"
    fightDate: "2025-04-15"
  }) {
    id
    eventId
    fighter1Id
    fighter2Id
    winnerId
    method
  }
}
```

### 5. Ranking (Рейтинги)

#### Создать рейтинг
```graphql
mutation {
  createRanking(data: { 
    fighterId: 1, 
    weightClassId: 1, 
    rank: 5 
  }) {
    id
    fighterId
    weightClassId
    rank
  }
}
```

## Отладка

### Очистка базы данных
```sql
TRUNCATE TABLE rankings, fights, events, fighters, weight_classes RESTART IDENTITY CASCADE;
```

### Просмотр схемы
```graphql
query {
  __schema {
    queryType {
      fields {
        name
      }
    }
    mutationType {
      fields {
        name
      }
    }
  }
}
```