# Компоненты профиля

Модульные компоненты для страницы профиля пользователя.

## Быстрый старт

```javascript
import {
  ProfileHeader,
  ProfileTab,
  AchievementsTab,
  NoteDialog,
} from '../components/profile';

// Использование в JSX
<ProfileHeader userProfile={userProfile} onLogout={handleLogout} />
<AchievementsTab achievements={achievements} stats={stats} />
<NoteDialog open={open} onClose={onClose} />
```

## Основные компоненты

| Компонент         | Описание             | Главные пропсы                        |
| ----------------- | -------------------- | ------------------------------------- |
| `ProfileHeader`   | Заголовок профиля    | `userProfile`, `onLogout`             |
| `ProfileTab`      | Вкладка "Профиль"    | `userProfile`, `editMode`, `formData` |
| `SkillsTab`       | Вкладка "Навыки"     | `skills`, `skillsStats`               |
| `NotesTab`        | Вкладка "Заметки"    | `notes`, `notesStats`                 |
| `AchievementsTab` | Вкладка "Достижения" | `achievements`, `stats`               |
| `FriendsTab`      | Вкладка "Друзья"     | `friends`, `pendingRequests`          |
| `ActivityTab`     | Вкладка "История"    | `activities`, `activityPage`          |

## Диалоги

| Компонент              | Описание                        | Главные пропсы                   |
| ---------------------- | ------------------------------- | -------------------------------- |
| `NoteDialog`           | Создание/редактирование заметки | `open`, `noteForm`, `topics`     |
| `PasswordChangeDialog` | Смена пароля                    | `open`, `passwordForm`           |
| `FindFriendsDialog`    | Поиск друзей                    | `open`, `allUsers`, `userSearch` |

## Вспомогательные

| Компонент            | Описание            | Использование     |
| -------------------- | ------------------- | ----------------- |
| `AvatarUpload`       | Загрузка аватара    | В ProfileTab      |
| `AchievementCard`    | Карточка достижения | В AchievementsTab |
| `AchievementFilters` | Фильтры достижений  | В AchievementsTab |

## Пример использования

```javascript
const ProfilePage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [noteDialog, setNoteDialog] = useState(false);
  // ... другие состояния

  return (
    <Container>
      <ProfileHeader userProfile={userProfile} onLogout={handleLogout} />

      <Tabs value={tabValue} onChange={setTabValue}>
        <Tab label="Профиль" />
        <Tab label="Достижения" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <ProfileTab
          userProfile={userProfile}
          editMode={editMode}
          formData={formData}
          onEditToggle={handleEditToggle}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <AchievementsTab
          achievements={achievements}
          stats={stats}
          getFilteredAchievements={getFilteredAchievements}
        />
      </TabPanel>

      <NoteDialog
        open={noteDialog}
        onClose={() => setNoteDialog(false)}
        noteForm={noteForm}
        topics={topics}
      />
    </Container>
  );
};
```

## Стилизация

Все компоненты используют Material-UI с консистентной темой:

- `sx` проп для стилизации
- Стандартные цвета темы (primary, secondary, success, etc.)
- Responsive дизайн с Grid системой

## Состояние

Компоненты получают данные через пропсы от родительского компонента.
Внутреннее состояние минимально и касается только UI логики.
