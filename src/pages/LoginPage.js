import { useState } from "react";
import { useAuth, useSnackbar } from "../hooks";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControlLabel,
  Checkbox,
  Link,
  Slide,
  Snackbar,
  Alert,
} from "@mui/material";

export default function LoginPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState(""); // состояние для email
  const [password, setPassword] = useState(""); // состояние для пароля
  const [name, setName] = useState(""); // состояние для имени (только для регистрации)
  const [isRegister, setIsRegister] = useState(false); // состояние для переключения между регистрацией и входом
  const [rememberMe, setRememberMe] = useState(false); // состояние для чекбокса "Запомнить меня"

  // Use custom hooks
  const { login, register, isLoading } = useAuth();
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSuccess,
    showError,
    hideSnackbar,
  } = useSnackbar();
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let result;

      if (isRegister) {
        result = await register({ name, email, password });
      } else {
        result = await login({ email, password }, rememberMe);
      }

      if (result.success) {
        showSuccess(result.message);
        if (isRegister) {
          setIsRegister(false);
          setName("");
        } else {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 1000);
        }
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError("An unexpected error occurred. Please try again.");
    }
  };

  const imageContent = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height: "100%",
        "@media (max-width: 1000px)": {
          display: "none",
        },
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
        alt="Login illustration"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: 30,
        }}
      />
    </Box>
  );

  const formContent = (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        textAlign: "left",
        padding: 5,
      }}
    >
      <Typography variant="h1" sx={{ fontSize: 60 }}>
        {t("auth.title")}
      </Typography>

      <Box>
        <Typography
          variant="h2"
          sx={{
            "@media (max-width: 760px)": {
              fontSize: "2rem",
            },
          }}
        >
          {isRegister ? t("auth.register.title") : t("auth.login.title")}
        </Typography>
        <Typography variant="caption" sx={{ fontSize: 20 }}>
          {isRegister ? t("auth.register.subtitle") : t("auth.login.subtitle")}
        </Typography>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {isRegister && (
          <TextField
            label={t("auth.register.nameLabel")}
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          ></TextField>
        )}
        <TextField
          label={t("auth.login.emailLabel")}
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label={t("auth.login.passwordLabel")}
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <FormControlLabel
            control={<Checkbox />}
            value={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            label={
              <Typography variant="body2">
                {t("auth.login.rememberMe")}
              </Typography>
            }
          />
          <Link href="/forgot-password" variant="body2">
            {t("auth.login.forgotPassword")}
          </Link>
        </Box>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          {isLoading
            ? t("auth.login.loading")
            : isRegister
            ? t("auth.register.registerButton")
            : t("auth.login.loginButton")}
        </Button>
      </Box>
      <Box>
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          <>
            {isRegister
              ? t("auth.register.haveAccount")
              : t("auth.login.noAccount")}
            <Link
              href="#"
              onClick={() => setIsRegister(!isRegister)}
              sx={{ textDecoration: "none", color: "#1976d2" }}
            >
              {isRegister
                ? t("auth.register.loginLink")
                : t("auth.login.registerLink")}
            </Link>
          </>
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "80%",
          height: "80%",
          display: "flex",
          gap: 2,
          borderRadius: 10,
          "@media (max-width: 800px)": {
            height: "100%",
            width: "100%",
            borderRadius: 0,
          },
        }}
      >
        <Slide
          direction="right"
          in={isRegister}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              display: isRegister ? "flex" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {imageContent}
            {formContent}
          </div>
        </Slide>
        <Slide
          direction="left"
          in={!isRegister}
          mountOnEnter
          unmountOnExit
          timeout={500}
        >
          <div
            style={{
              display: !isRegister ? "flex" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            {formContent}
            {imageContent}
          </div>
        </Slide>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={hideSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
