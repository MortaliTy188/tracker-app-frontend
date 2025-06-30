import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

const PasswordChangeDialog = ({ open, onClose, passwordForm, onSubmit }) => {
  const { t } = useTranslation();
  const { formData, handleInputChange, errors, handleSubmit, isSubmitting } =
    passwordForm;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("profile.security.changePassword")}</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label={t("profile.security.currentPassword")}
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword}
          />
          <TextField
            fullWidth
            label={t("profile.security.newPassword")}
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <TextField
            fullWidth
            label={t("profile.security.confirmPassword")}
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          {t("profile.security.changePassword")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog;
