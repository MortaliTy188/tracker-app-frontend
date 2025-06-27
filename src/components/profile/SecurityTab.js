import React from "react";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

/**
 * Компонент вкладки безопасности
 */
export default function SecurityTab({ onChangePasswordOpen }) {
  return (
    <Grid
      container
      spacing={3}
      justifyContent="space-between"
      alignItems="center"
    >
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Безопасность аккаунта
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Управление паролем и настройками безопасности
            </Typography>
            <Button variant="contained" onClick={onChangePasswordOpen}>
              Изменить пароль
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Двухфакторная аутентификация
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Дополнительный уровень защиты для вашего аккаунта
            </Typography>
            <Button variant="outlined" disabled>
              Настроить 2FA (скоро)
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
