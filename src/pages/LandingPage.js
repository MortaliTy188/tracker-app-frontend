import * as React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { Button, Typography, Container, Box } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";

// Примерные значения для страниц и настроек
const pages = ["Home", "About", "Contact"];
const settings = ["Profile", "Account", "Logout"];

export default function LandingPage() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ backgroundColor: "#710f6f; color: #fff" }}>
      <Navbar
        pages={pages}
        settings={settings}
        anchorElNav={anchorElNav}
        setAnchorElNav={setAnchorElNav}
        anchorElUser={anchorElUser}
        setAnchorElUser={setAnchorElUser}
        handleOpenNavMenu={handleOpenNavMenu}
        handleCloseNavMenu={handleCloseNavMenu}
        handleOpenUserMenu={handleOpenUserMenu}
        handleCloseUserMenu={handleCloseUserMenu}
      />
      <Box
        maxWidth="90vw"
        margin={"3rem auto"}
        id="showcase"
        sx={{
          position: "relative",
          minHeight: "100vh",
          py: 8,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/images/hand-with-marker-wri.jpg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          color: "#fff",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 1,
          },
          "& > *": {
            position: "relative",
            zIndex: 2,
          },
        }}
      >
        <Typography variant="h1" gutterBottom>
          Комфортно следите за обучением
        </Typography>
        <Typography variant="body1" sx={{ fontSize: 20, marginBottom: 4 }}>
          Удобно отслеживайте свой прогресс в нашем интуитивном приложении,
          созданном для упрощения обучения и достижения лучших результатов
        </Typography>
        <Button
          href="/login"
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#115293",
            },
          }}
        >
          Начать обучение
        </Button>
      </Box>
      <Box>
        <Container
          maxWidth="false"
          id="why-choose-us"
          sx={{ minHeight: "100vh", py: 15 }}
        >
          <Typography variant="h3" gutterBottom>
            Почему выбирают нас?
          </Typography>
          <Typography>
            Помогаем людям учиться осознанно: отслеживайте цели, задачи и
            прогресс в понятной системе, которая мотивирует двигаться вперёд.
          </Typography>
          <Box
            sx={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <List
              sx={{
                my: 4,
                width: "100%",
                maxWidth: "60%",
                bgcolor: "inherit",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <ListItem alignItems="flex-start" sx={{ width: "100%" }}>
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Фокус на результат"
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "text.primary", display: "inline" }}
                      ></Typography>
                      <Typography component="span" sx={{ color: "#fff" }}>
                        Наше приложение не просто список задач — это инструмент
                        для достижения учебных целей. Гибкая настройка целей,
                        статусов и заметок помогает сохранять фокус и видеть
                        реальные результаты.
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start" sx={{ width: "100%" }}>
                <ListItemAvatar>
                  <Avatar
                    alt="Travis Howard"
                    src="/static/images/avatar/2.jpg"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary="Прозрачность и мотивация"
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "#fff", display: "inline" }}
                      >
                        Пошаговый прогресс, проценты выполнения и визуальные
                        индикаторы дают полную картину вашего развития. Это
                        мотивирует продолжать обучение и не терять темп.
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem alignItems="flex-start" sx={{ width: "100%" }}>
                <ListItemAvatar>
                  <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                </ListItemAvatar>
                <ListItemText
                  primary="Подходит для любого подхода к обучению"
                  secondary={
                    <React.Fragment>
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ color: "#fff", display: "inline" }}
                      >
                        Вы можете использовать платформу для самообразования,
                        учёбы в вузе, курсов или корпоративного обучения. Гибкая
                        структура позволяет адаптироваться под любые задачи и
                        стили.
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </List>
          </Box>
        </Container>
      </Box>

      <Container
        maxWidth="md"
        id="fast-introduction"
        sx={{ minHeight: "100vh", py: 8 }}
      >
        <Typography variant="h3" gutterBottom>
          Краткое знакомство
        </Typography>
        <Typography>Быстрое знакомство с возможностями приложения.</Typography>
      </Container>
      <Container
        maxWidth="md"
        id="what-will-you-get"
        sx={{ minHeight: "100vh", py: 8 }}
      >
        <Typography variant="h3" gutterBottom>
          Что вы получите
        </Typography>
        <Typography>Описание того, что получит пользователь.</Typography>
      </Container>
      <Container maxWidth="md" id="reviews" sx={{ minHeight: "100vh", py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Отзывы
        </Typography>
        <Typography>Отзывы пользователей о приложении.</Typography>
      </Container>
      <Container maxWidth="md" id="prices" sx={{ minHeight: "100vh", py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Цены
        </Typography>
        <Typography>Информация о тарифах и стоимости.</Typography>
      </Container>
      <Container maxWidth="md" id="faq" sx={{ minHeight: "100vh", py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Вопросы и ответы
        </Typography>
        <Typography>Часто задаваемые вопросы.</Typography>
      </Container>
      <Container maxWidth="md" id="contacts" sx={{ minHeight: "100vh", py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Контакты
        </Typography>
        <Typography>Контактная информация.</Typography>
      </Container>
    </Box>
  );
}
