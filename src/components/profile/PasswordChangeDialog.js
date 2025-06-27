import React from "react";
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
  const { formData, handleInputChange, errors, handleSubmit, isSubmitting } =
    passwordForm;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Смена пароля</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Текущий пароль"
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
            label="Новый пароль"
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
            label="Подтвердите новый пароль"
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
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
        >
          Изменить пароль
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasswordChangeDialog;
