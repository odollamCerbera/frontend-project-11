### Hexlet tests and linter status:
[![Actions Status](https://github.com/odollamCerbera/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/odollamCerbera/frontend-project-11/actions) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=odollamCerbera_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=odollamCerbera_frontend-project-11) [![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=odollamCerbera_frontend-project-11&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=odollamCerbera_frontend-project-11)

# Проект - "RSS агрегатор"

RSS-агрегатор - это веб-приложение для автоматического сбора сообщений, новостей, статей и обновлений с различных веб-сайтов, блогов и каналов в одном месте. Оно позволяет пользователям читать контент из нескольких источников в едином интерфейсе без необходимости посещать каждый сайт отдельно. RSS-агрегатор позволяет пользователям добавлять несколько RSS-каналов и управлять ими, автоматически обновлять каналы в режиме реального времени и читать контент с помощью простого и удобного интерфейса.

### Основные возможности:
- Добавление и управление несколькими RSS-лентами
- Автоматическое обновление лент
- Получение контента в реальном времени
- Чистый и адаптивный интерфейс
- Модальное окно для чтения статей
- Валидация форм с обратной связью для пользователя
- Поддержка мультиязычности (i18n)

## Как использовать:
- Добавление ленты: Введите корректный URL RSS-ленты в поле ввода
- Валидация: Приложение проверяет формат URL и наличие дубликатов
- Парсинг ленты: RSS-лента загружается и парсится через прокси-сервер (для обхода CORS)
- Отображение: Ленты и их посты отображаются в организованных разделах
- Чтение: Нажмите на любой пост, чтобы прочитать содержание в модальном окне
- Автоматическое обновление: Ленты автоматически обновляются каждые 5 секунд

## Демонстрация: 

Попробуйте приложение в действии: [RSS Агрегатор Демо](https://frontend-project-11-rss-reader.vercel.app/)

## Установка:
После клонирования репозитория необходимо установить все зависимости:
```
git clone https://github.com/odollamCerbera/rss-aggregator.git
make install  
```
