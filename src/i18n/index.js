import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Импорт переводов
import en from "./locales/en.json";
import ru from "./locales/ru.json";

const resources = {
  en: {
    translation: en,
  },
  ru: {
    translation: ru,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // Убираем принудительную установку языка, пусть LanguageDetector определяет
    fallbackLng: "ru", // Русский как резервный язык
    debug: process.env.NODE_ENV === "development",

    detection: {
      // Порядок поиска языка: сначала localStorage, потом sessionStorage, потом браузер
      order: [
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "subdomain",
      ],
      // Сохраняем выбор в localStorage и sessionStorage
      caches: ["localStorage", "sessionStorage"],
      // Ключ для сохранения в storage
      lookupLocalStorage: "i18nextLng",
      lookupSessionStorage: "i18nextLng",
      // Не проверять на каждой странице заново
      checkWhitelist: true,
    },

    interpolation: {
      escapeValue: false, // React уже экранирует значения
    },

    react: {
      useSuspense: false,
    },

    // Список поддерживаемых языков
    supportedLngs: ["ru", "en"],
    // Не загружать namespace по умолчанию
    load: "languageOnly",
  });

// Добавляем логирование изменений языка для отладки
if (process.env.NODE_ENV === "development") {
  i18n.on("languageChanged", (lng) => {
    console.log("🌐 Language changed to:", lng);
    console.log(
      "🌐 localStorage i18nextLng:",
      localStorage.getItem("i18nextLng")
    );
    console.log(
      "🌐 sessionStorage i18nextLng:",
      sessionStorage.getItem("i18nextLng")
    );
  });

  i18n.on("initialized", (options) => {
    console.log("🌐 i18n initialized with language:", i18n.language);
    console.log("🌐 i18n options:", options);
  });
}

export default i18n;
