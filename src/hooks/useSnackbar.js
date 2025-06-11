import { useState } from "react";

/**
 * Custom hook for managing Snackbar notifications
 */
export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const showSnackbar = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const showSuccess = (message) => {
    showSnackbar(message, "success");
  };

  const showError = (message) => {
    showSnackbar(message, "error");
  };

  const showInfo = (message) => {
    showSnackbar(message, "info");
  };

  const showWarning = (message) => {
    showSnackbar(message, "warning");
  };

  const hideSnackbar = () => {
    setSnackbarOpen(false);
  };

  return {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideSnackbar,
  };
};
