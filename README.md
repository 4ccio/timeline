# Timeline Project

Интерактивная временная шкала исторических событий с анимациями на React + TypeScript + GSAP.

## Установка

```bash
# Клонирование репозитория
git clone https://github.com/4ccio/timeline.git
cd timeline

# Установка зависимостей
npm install
```

## Запуск проекта

### Режим разработки

```bash
npm start
```

Откроется dev сервер по адресу http://localhost:3000

### Сборка для продакшена

```bash
npm run build:prod
```

Результат сборки в папке `build/`

### Сборка для разработки

```bash
npm run build:dev
```

## Структура проекта

```
src/
├── app/
│   ├── App.tsx              # Главный компонент
│   ├── data/                # Данные временных периодов
│   ├── styles/              # Глобальные стили
│   └── types/               # Типы
├── components/
│   ├── Timeline/            # Основной компонент блока
│   ├── Circle/              # Круговая навигация
│   ├── Years/               # Компонент временного диапазона
│   ├── Slider/              # Слайдер событий
│   └── PeriodsChanger/      # Управление периодами
├── hooks/                   # Кастомные хуки
│   ├── useCircleCoords.ts   # Расчет координат окружности
│   └── useMediaQuery.ts     # Медиа-запросы
└── index.tsx                # Точка входа
```
