import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Person,
  Settings,
  ExitToApp,
  Login,
  Dashboard,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, useProfile } from "../hooks";
import { getAvatarUrl } from "../utils/avatarUtils";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { t } = useTranslation();
  const { isAuthenticated, logout, getUser } = useAuth();
  const { getFullInfo } = useProfile();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    setUserProfile(null); // Очищаем данные пользователя
    handleClose();
    window.location.href = "/";
  };
  const handleProfile = () => {
    handleClose();
    window.location.href = "/profile";
  };

  const handleDashboard = () => {
    handleClose();
    window.location.href = "/dashboard";
  };

  const handleLogin = () => {
    window.location.href = "/login";
  }; // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    const loadUserData = async () => {
      const isAuth =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      if (isAuth) {
        try {
          // Сначала пробуем получить из localStorage/sessionStorage
          const userStr =
            localStorage.getItem("user") || sessionStorage.getItem("user");
          if (userStr) {
            const localUser = JSON.parse(userStr);
            setUserProfile({ user: localUser });
          }

          // Затем загружаем полные данные с сервера
          const result = await getFullInfo();
          if (result.success) {
            setUserProfile(result.data);
          }
        } catch (error) {
          console.error("Error loading user data in navbar:", error);
        }
      } else {
        // Если пользователь не авторизован, очищаем данные
        setUserProfile(null);
      }
    };

    loadUserData();
  }, []); // Пустой массив зависимостей

  // Слушаем события обновления профиля
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail && event.detail.user) {
        setUserProfile(event.detail);
      }
    };

    window.addEventListener("profileUpdated", handleProfileUpdate);

    return () => {
      window.removeEventListener("profileUpdated", handleProfileUpdate);
    };
  }, []);

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", color: "#000", padding: 2 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: { md: "column", lg: "row" },
            }}
          >
            <Button href="#showcase" color="inherit">
              {t("navbar.showcase")}
            </Button>
            <Button href="#why-choose-us" color="inherit">
              {t("navbar.whyChoose")}
            </Button>
            <Button href="#fast-introduction" color="inherit">
              {t("navbar.introduction")}
            </Button>
            <Button href="#what-will-you-get" color="inherit">
              {t("navbar.whatYouGet")}
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h2">Tracker App</Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: { md: "column", lg: "row" },
            }}
          >
            <Button href="#reviews" color="inherit">
              {t("navbar.reviews")}
            </Button>
            <Button href="#prices" color="inherit">
              {t("navbar.prices")}
            </Button>
            <Button href="#faq" color="inherit">
              {t("navbar.faq")}
            </Button>{" "}
            <Button href="#contacts" color="inherit">
              {t("navbar.contacts")}
            </Button>
            {isAuthenticated() ? (
              <>
                <LanguageSwitcher variant="menu" />
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {" "}
                  <Avatar
                    src={
                      userProfile?.user?.avatar
                        ? getAvatarUrl(userProfile.user.avatar)
                        : undefined
                    }
                    sx={{ width: 32, height: 32 }}
                  >
                    {!userProfile?.user?.avatar &&
                      (userProfile?.user?.name ? (
                        userProfile.user.name.charAt(0)
                      ) : (
                        <Person />
                      ))}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  {" "}
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      <Dashboard fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("navbar.dashboard")}</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <Person fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("navbar.profile")}</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t("navbar.logout")}</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <LanguageSwitcher variant="menu" />
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  onClick={handleLogin}
                  sx={{ ml: 2 }}
                >
                  {t("navbar.login")}
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
