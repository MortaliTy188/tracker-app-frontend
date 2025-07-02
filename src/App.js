import "./App.css";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePageOld";
import ProfilePageModular from "./pages/ProfilePageModular";
import DashboardPage from "./pages/DashboardPage";
import { useLastVisit } from "./hooks/useLastVisit";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function App() {
  useLastVisit();
  const { i18n } = useTranslation();

  // Проверяем и восстанавливаем сохраненный язык при запуске приложения
  useEffect(() => {
    const savedLanguage =
      localStorage.getItem("i18nextLng") ||
      sessionStorage.getItem("i18nextLng");
    console.log("App mounted, saved language:", savedLanguage);
    console.log("Current i18n language:", i18n.language);

    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log("Restoring language to:", savedLanguage);
      i18n.changeLanguage(savedLanguage);
    } else if (!savedLanguage) {
      // Если нет сохраненного языка, устанавливаем русский по умолчанию
      console.log("No saved language, setting default to Russian");
      i18n.changeLanguage("ru");
      localStorage.setItem("i18nextLng", "ru");
      sessionStorage.setItem("i18nextLng", "ru");
    }
  }, [i18n]);

  return (
    <div className="App">
      {" "}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePageModular />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profileOld"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
