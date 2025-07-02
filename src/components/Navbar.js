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
  useScrollTrigger,
  Slide,
} from "@mui/material";
import {
  Person,
  Dashboard,
  ExitToApp,
  Login,
  Home,
  Info,
  QuestionAnswer,
  LibraryBooks,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth, useProfile } from "../hooks";
import { getAvatarUrl } from "../utils/avatarUtils";
import LanguageSwitcher from "./LanguageSwitcher";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

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
  const handleLibrary = () => {
    handleClose();
    window.location.href = "/library"; // Будущая страница библиотеки
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
  };

  // Функция для плавной прокрутки к секции
  const handleSmoothScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Функция для прокрутки к началу страницы
  const handleScrollToTop = () => {
    // Пытаемся найти hero секцию с id="home"
    const homeElement = document.getElementById("home");
    if (homeElement) {
      homeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      // Если секция не найдена, прокручиваем к самому верху
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
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
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
          boxShadow: "0 2px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 70 },
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="h5"
                component="a"
                href="/"
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textDecoration: "none",
                  fontSize: { xs: "1.2rem", md: "1.5rem" },
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tracker App
              </Typography>
            </Box>

            {/* Navigation Links - только для десктопа */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 1,
              }}
            >
              {isAuthenticated() ? (
                // Навигация для авторизованных пользователей
                <>
                  <Button
                    href="/"
                    startIcon={<Home />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.home")}
                  </Button>
                  <Button
                    href="/dashboard"
                    startIcon={<Dashboard />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.dashboard")}
                  </Button>
                  <Button
                    href="/library"
                    startIcon={<LibraryBooks />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.library")}
                  </Button>
                </>
              ) : (
                // Навигация для неавторизованных пользователей
                <>
                  <Button
                    onClick={handleScrollToTop}
                    startIcon={<Home />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.home")}
                  </Button>
                  <Button
                    onClick={() => handleSmoothScroll("features")}
                    startIcon={<Info />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.features")}
                  </Button>
                  <Button
                    onClick={() => handleSmoothScroll("faq")}
                    startIcon={<QuestionAnswer />}
                    sx={{
                      color: "text.primary",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
                    {t("navbar.faq")}
                  </Button>
                </>
              )}
            </Box>

            {/* Right side - Language switcher and user menu */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LanguageSwitcher />

              {isAuthenticated() ? (
                <>
                  <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{
                      border: "2px solid",
                      borderColor: "primary.main",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.1)",
                      },
                    }}
                  >
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
                      elevation: 8,
                      sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 4px 20px rgba(0,0,0,0.15))",
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 200,
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
                    <MenuItem onClick={handleDashboard}>
                      <ListItemIcon>
                        <Dashboard fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{t("navbar.dashboard")}</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleLibrary}>
                      <ListItemIcon>
                        <LibraryBooks fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>{t("navbar.library")}</ListItemText>
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
                <Button
                  variant="contained"
                  startIcon={<Login />}
                  onClick={handleLogin}
                  sx={{
                    borderRadius: 3,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    boxShadow: "0 4px 14px rgba(25, 118, 210, 0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(25, 118, 210, 0.4)",
                      transform: "translateY(-1px)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {t("navbar.login")}
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
}
