import React from "react";
import { useTranslation } from "react-i18next";
import { Grid, Card, CardContent, Typography, Button } from "@mui/material";

/**
 * Компонент вкладки безопасности
 */
export default function SecurityTab({ onChangePasswordOpen }) {
  const { t } = useTranslation();

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
              {t("security.accountSecurity")}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {t("security.passwordAndSettings")}
            </Typography>
            <Button variant="contained" onClick={onChangePasswordOpen}>
              {t("profile.security.changePassword")}
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t("security.twoFactorAuth")}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              {t("security.additionalProtection")}
            </Typography>
            <Button variant="outlined" disabled>
              {t("security.setup2FA")}
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
