import "./App.css";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePageOld";
import ProfilePageModular from "./pages/ProfilePageModular";
import DashboardPage from "./pages/DashboardPage";
import { useLastVisit } from "./hooks/useLastVisit";
import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  useLastVisit();

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
