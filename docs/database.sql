-- Создание таблицы весовых категорий
CREATE TABLE weight_classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  min_weight FLOAT NOT NULL,
  max_weight FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы бойцов
CREATE TABLE fighters (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  date_of_birth VARCHAR(10),
  height FLOAT,
  reach FLOAT,
  last_weigh_in FLOAT,
  affiliation VARCHAR(255),
  born VARCHAR(255),
  fighting_out_of VARCHAR(255),
  weight_class_id INTEGER NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  knockouts INTEGER DEFAULT 0,
  submissions INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  current_streak_type VARCHAR(10),
  career_earnings INTEGER DEFAULT 0,
  last_fight_date VARCHAR(10),
  FOREIGN KEY (weight_class_id) REFERENCES weight_classes(id) ON DELETE RESTRICT
);

-- Создание таблицы событий
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date VARCHAR(10) NOT NULL,
  location VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы боев
CREATE TABLE fights (
  id SERIAL PRIMARY KEY,
  event_id INTEGER NOT NULL,
  fighter1_id INTEGER NOT NULL,
  fighter2_id INTEGER NOT NULL,
  winner_id INTEGER,
  method VARCHAR(50),
  round INTEGER,
  time VARCHAR(5),
  fight_date VARCHAR(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (fighter1_id) REFERENCES fighters(id) ON DELETE RESTRICT,
  FOREIGN KEY (fighter2_id) REFERENCES fighters(id) ON DELETE RESTRICT,
  FOREIGN KEY (winner_id) REFERENCES fighters(id) ON DELETE SET NULL
);

-- Создание таблицы рейтингов
CREATE TABLE rankings (
  id SERIAL PRIMARY KEY,
  fighter_id INTEGER NOT NULL,
  weight_class_id INTEGER NOT NULL,
  rank INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fighter_id) REFERENCES fighters(id) ON DELETE CASCADE,
  FOREIGN KEY (weight_class_id) REFERENCES weight_classes(id) ON DELETE RESTRICT,
  CONSTRAINT unique_fighter_weight_class UNIQUE (fighter_id, weight_class_id)
);

-- Индексы для оптимизации
CREATE INDEX idx_fights_event_id ON fights(event_id);
CREATE INDEX idx_rankings_weight_class_id ON rankings(weight_class_id);