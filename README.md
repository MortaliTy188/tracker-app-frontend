# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# tracker-app-frontend

tracker-app-frontend — это клиентская часть современного трекер-приложения для управления навыками, темами, заметками, достижениями и социальной активностью пользователей.

## Технологический стек
- **React** — компонентный подход, хуки, функциональные компоненты
- **Material-UI (MUI)** — современный UI-фреймворк для стилизации и адаптивности
- **i18next** — поддержка мультиязычности (русский, английский)
- **JavaScript (ES6+)**
- **REST API** — взаимодействие с сервером (tracker-app-server)
- **localStorage/sessionStorage** — хранение токена авторизации

## Структура проекта
- `src/components/` — основные UI-компоненты (SkillsTab, Profile, Notes и др.)
- `src/pages/` — страницы приложения (DashboardPage, ProfilePage и др.)
- `src/api/` — обёртки для работы с REST API
- `src/hooks/` — пользовательские хуки для повторно используемой логики
- `src/i18n/` — файлы локализации (ru.json, en.json), настройка i18next
- `src/utils/` — вспомогательные функции и утилиты
- `public/` — статические файлы, favicon, index.html и др.

## Основные возможности
- **Навыки и темы**: создание, просмотр, добавление тем к навыкам через модальные окна, отображение прогресса, категорий и статусов
- **Заметки**: создание, редактирование, удаление, привязка к темам
- **Достижения**: отображение, фильтрация, поддержка категорий и редкости, локализация
- **Друзья**: поиск, добавление, удаление, отображение статистики друзей
- **Чат**: интеграция с серверной системой чата, поддержка статусов сообщений, история переписки
- **Статистика**: диаграммы и графики по навыкам, темам, достижениям
- **Аутентификация**: хранение и использование JWT-токена для защищённых запросов
- **Локализация**: поддержка русского и английского языков, перевод всех интерфейсных элементов, категорий, статусов
- **Модальные окна**: для создания и редактирования сущностей (навыки, темы, заметки и др.)
- **Гибкая система отображения статусов, категорий, прогресса**: все статусы и категории локализованы, отображаются с помощью Chip/Badge

## Технические решения
- **Модульная архитектура**: разделение на компоненты, хуки, страницы, утилиты
- **Современный UI/UX**: использование MUI, адаптивная верстка, единый стиль
- **Локализация**: централизованная система переводов, поддержка динамических ключей
- **Безопасность**: все защищённые запросы отправляются с JWT-токеном
- **Гибкая интеграция с backend**: все данные и действия синхронизируются с сервером через REST API
- **Обработка ошибок**: отображение ошибок пользователю через Alert, валидация форм
- **Расширяемость**: легко добавлять новые сущности, страницы, переводы

## Пример основных компонентов
- **SkillsTab** — вкладка управления навыками, поддержка создания навыка и добавления тем через модальные окна, отображение прогресса и статусов
- **DashboardPage** — главная страница с общей статистикой, графиками, быстрыми действиями
- **Profile** — страница профиля пользователя, вкладки для навыков, заметок, достижений, друзей и настроек
- **Chat** — интеграция с серверной системой чата, поддержка статусов сообщений, история переписки

## Локализация
- Все текстовые элементы, статусы, категории, кнопки и сообщения об ошибках вынесены в файлы локализации (`ru.json`, `en.json`)
- Используется i18next с поддержкой динамических ключей и fallback на дефолтные значения

## Взаимодействие с сервером
- Все запросы к API отправляются с токеном авторизации
- Используются fetch/axios для асинхронных запросов
- Обработка ошибок и отображение пользователю

## Запуск и настройка
1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите приложение:
   ```bash
   npm start
   ```
3. Настройте переменные окружения (например, адрес API) при необходимости

## Разработка и расширение
- Для добавления новых языков — расширьте файлы локализации в `src/i18n/locales/`
- Для добавления новых сущностей — создайте компонент, добавьте API-обёртку, настройте локализацию
- Для интеграции с новым API — добавьте методы в `src/api/` и используйте их в компонентах

---

tracker-app-frontend — современное, расширяемое и локализованное SPA-приложение для трекинга навыков, тем, заметок, достижений и социальной активности пользователей.
