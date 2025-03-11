# MMA Platform

Платформа для управления данными о бойцах, событиях, боях и рейтингах в смешанных единоборствах (MMA). Реализована с использованием **NestJS**, **TypeORM**, **PostgreSQL** и **GraphQL**.

## 📝 Описание проекта

Это приложение предоставляет API для работы с сущностями MMA, такими как весовые категории, бойцы, события, бои и рейтинги. Оно поддерживает полный CRUD (Create, Read, Update, Delete) для всех сущностей и включает логику автоматического обновления рейтингов после завершения боев.

### Основные модули

1. **WeightClass** - управление весовыми категориями
2. **Fighter** - управление бойцами и их статистикой
3. **Event** - управление событиями (турнирами)
4. **Fight** - управление боями между бойцами
5. **Ranking** - управление рейтингами бойцов в весовых категориях

## 🔧 Требования

- **Node.js**: v18.x или выше
- **PostgreSQL**: v13.x или выше
- **npm**: v8.x или выше

## 🚀 Установка и запуск

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

API будет доступно по адресу: `http://localhost:3000/graphql`

## 📁 Структура проекта

```
mma-platform/
├── src/
│   ├── dto/                # DTO для валидации входных данных
│   ├── entities/           # Сущности TypeORM
│   ├── event/             # Модуль событий
│   ├── fight/             # Модуль боев
│   ├── fighter/           # Модуль бойцов
│   ├── ranking/           # Модуль рейтингов
│   ├── weight-class/      # Модуль весовых категорий
│   ├── app.module.ts      # Главный модуль приложения
│   ├── main.ts            # Точка входа
│   └── schema.gql         # Автогенерируемая GraphQL-схема
├── package.json
└── README.md
```

## 📊 GraphQL API

### WeightClass (Весовые категории)

#### Создание весовой категории
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
  }
}
```

#### Получение всех весовых категорий
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

### Fighter (Бойцы)

#### Создание бойца
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
  }
}
```

#### Получение статистики бойца
```graphql
query {
  fighterStats(id: 1) {
    wins
    losses
    draws
    knockouts
    submissions
  }
}
```

### Event (События)

#### Создание события
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

#### Получение предстоящих событий
```graphql
# Возвращает события с датой позже текущей
query {
  upcomingEvents {
    id
    name
    date
    location
    fights {
      fighter1 {
        firstName
        lastName
      }
      fighter2 {
        firstName
        lastName
      }
    }
  }
}
```

### Fight (Бои)

#### Создание боя
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
    method
  }
}
```

#### Обновление результата боя
```graphql
mutation {
  updateFight(id: 1, data: { 
    winnerId: 2,
    method: "Submission",
    round: 3
  }) {
    id
    winner {
      firstName
      lastName
    }
    method
    round
  }
}
```

### Ranking (Рейтинги)

#### Создание/обновление рейтинга
```graphql
mutation {
  createRanking(data: { 
    fighterId: 1, 
    weightClassId: 1, 
    rank: 5 
  }) {
    id
    rank
    fighter {
      firstName
      lastName
    }
  }
}
```

#### Получение рейтингов по весовой категории
```graphql
query {
  rankingsByWeightClass(weightClassId: 1) {
    rank
    fighter {
      firstName
      lastName
    }
  }
}
```

#### Ручное обновление рейтингов
```graphql
mutation {
  updateRankingsAfterFight(fightId: 1)
}
```

## 📝 Примечания

1. **Автоматическое обновление рейтингов**: 
   - Происходит автоматически при:
     - Создании нового боя (`createFight`)
     - Обновлении существующего боя (`updateFight`)
   - Условия обновления:
     - Указан победитель боя (`winnerId`)
     - Бойцы принадлежат к одной весовой категории
   - Ручное обновление доступно через `updateRankingsAfterFight(fightId)`

2. **Работа с датами**:
   - Для `upcomingEvents` используется текущая системная дата
   - Формат дат: `YYYY-MM-DD` (например, "2025-04-15")
   - При создании события убедитесь, что дата события больше текущей

3. **Обработка ошибок**:
   - При запросе несуществующих данных возвращается ошибка `NOT_FOUND`
   - Все мутации включают валидацию входных данных
   - При некорректных данных возвращается ошибка с описанием проблемы

4. **Документация**:
   - ERD доступна в `docs/erd.png`
   - SQL-скрипты находятся в `docs/database.sql`

## 🔍 Отладка

### Очистка базы данных
```sql
TRUNCATE TABLE rankings, fights, events, fighters, weight_classes 
RESTART IDENTITY CASCADE;
```

### Просмотр GraphQL схемы
```graphql
query {
  __schema {
    queryType {
      fields {
        name
      }
    }
  }
}
```