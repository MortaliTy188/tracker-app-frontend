import React from "react";
import { useAuth } from "../hooks";
import { Box, Container, Alert, Button } from "@mui/material";

/**
 * Protected Route Component
 * Wraps components that require authentication
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => (window.location.href = "/login")}
            >
              Войти
            </Button>
          }
        >
          Для доступа к этой странице необходимо авторизоваться
        </Alert>
      </Container>
    );
  }

  return children;
};

export default ProtectedRoute;
