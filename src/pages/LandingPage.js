import * as React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  Button,
  Typography,
  Container,
  Box,
  Card,
  CardHeader,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Grid,
  TextField,
} from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SendIcon from "@mui/icons-material/Send";

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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Здесь будет логика отправки формы
    console.log("Form data:", formData);
    // Сброс формы после отправки
    setFormData({ name: "", email: "", subject: "", message: "" });
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

      <Box
        sx={{
          width: "100vw",
          height: "70vh",
          backgroundColor: "#fff",
          color: "#000",
        }}
      >
        <Container
          maxWidth="md"
          id="fast-introduction"
          sx={{
            minHeight: "100%",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom sx={{ mb: 6, fontSize: 56 }}>
              Краткое знакомство
            </Typography>
            <Typography sx={{ fontSize: 24 }}>
              Быстрое знакомство с возможностями приложения.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 15,
              width: "100%",
              gap: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#eee",
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">1</Typography>
              <Typography variant="h4">Настройка целей</Typography>
              <Typography variant="body1">
                Определение ключевых целей и разбиение их на темы и задачи
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#eee",
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">1</Typography>
              <Typography variant="h4">Настройка целей</Typography>
              <Typography variant="body1">
                Определение ключевых целей и разбиение их на темы и задачи
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#eee",
                padding: 2,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1">1</Typography>
              <Typography variant="h4">Настройка целей</Typography>
              <Typography variant="body1">
                Определение ключевых целей и разбиение их на темы и задачи
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box>
        <Container
          maxWidth="false"
          id="why-choose-us"
          sx={{ minHeight: "100vh", py: 15 }}
        >
          <Typography variant="h3" gutterBottom>
            Что вы получите?
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

      <Box
        sx={{
          width: "100vw",
          height: "70vh",
          backgroundColor: "#fff",
          color: "#000",
        }}
      >
        <Container
          maxWidth="md"
          id="fast-introduction"
          sx={{
            minHeight: "100%",
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom sx={{ fontSize: 56 }}>
              Отзывы пользователей
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              mt: 15,
              width: "100%",
              gap: 5,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#eee",
                justifyContent: "space-between",
              }}
            >
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                  }
                  title="Отличное приложение для обучения"
                  subheader="Cindy Baker"
                ></CardHeader>
                <CardContent>
                  <Typography variant="body2">
                    Использую это приложение уже полгода. Очень удобно
                    отслеживать прогресс по разным предметам и видеть общую
                    картину обучения.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#eee",
                justifyContent: "space-between",
              }}
            >
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                  }
                  title="Отличное приложение для обучения"
                  subheader="Cindy Baker"
                ></CardHeader>
                <CardContent>
                  <Typography variant="body2">
                    Использую это приложение уже полгода. Очень удобно
                    отслеживать прогресс по разным предметам и видеть общую
                    картину обучения.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#eee",
                justifyContent: "space-between",
              }}
            >
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                  }
                  title="Отличное приложение для обучения"
                  subheader="Cindy Baker"
                ></CardHeader>
                <CardContent>
                  <Typography variant="body2">
                    Использую это приложение уже полгода. Очень удобно
                    отслеживать прогресс по разным предметам и видеть общую
                    картину обучения.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#eee",
                justifyContent: "space-between",
              }}
            >
              <Card sx={{ maxWidth: "100%" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt="Cindy Baker"
                      src="/static/images/avatar/3.jpg"
                    />
                  }
                  title="Отличное приложение для обучения"
                  subheader="Cindy Baker"
                ></CardHeader>
                <CardContent>
                  <Typography variant="body2">
                    Использую это приложение уже полгода. Очень удобно
                    отслеживать прогресс по разным предметам и видеть общую
                    картину обучения.
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
      <Box>
        <Container
          maxWidth="false"
          id="why-choose-us"
          sx={{ minHeight: "80vh", py: 15 }}
        >
          <Box sx={{ mb: 15 }}>
            <Typography variant="h3" gutterBottom>
              Гибкие цены
            </Typography>
            <Typography variant="body1" sx={{ fontSize: 20 }}>
              Выберите подходящий тарифный план. Мы предлагаем разные варианты
              подписки и бесплатный пробный период
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
              mt: 4,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <img
                src="images/photo1.jpg"
                alt="Тарифный план 1"
                style={{
                  width: "50%",
                  borderRadius: 8,
                  marginBottom: 5,
                  alignSelf: "center",
                }}
              />
              <Typography variant="h3" gutterBottom sx={{ fontSize: 24 }}>
                Базовый тариф
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 14, mb: 2 }}>
                0 Руб
              </Typography>
              <Typography variant="body1">
                Создание целей и зачач, отслеживание прогресса в процентах
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <img
                src="images/photo1.jpg"
                alt="Тарифный план 1"
                style={{
                  width: "50%",
                  borderRadius: 8,
                  marginBottom: 5,
                  alignSelf: "center",
                }}
              />
              <Typography variant="h3" gutterBottom sx={{ fontSize: 24 }}>
                Базовый тариф
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 14, mb: 2 }}>
                0 Руб
              </Typography>
              <Typography variant="body1">
                Создание целей и зачач, отслеживание прогресса в процентах
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                textAlign: "left",
              }}
            >
              <img
                src="images/photo1.jpg"
                alt="Тарифный план 1"
                style={{
                  width: "50%",
                  borderRadius: 8,
                  marginBottom: 5,
                  alignSelf: "center",
                }}
              />
              <Typography variant="h3" gutterBottom sx={{ fontSize: 24 }}>
                Базовый тариф
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 14, mb: 2 }}>
                0 Руб
              </Typography>
              <Typography variant="body1">
                Создание целей и зачач, отслеживание прогресса в процентах
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      <Box sx={{ height: "70vh", width: "100vw", backgroundColor: "#fff" }}>
        <Container maxWidth="md" id="faq" sx={{ minHeight: "100vh", py: 2 }}>
          <Typography variant="h3" gutterBottom sx={{ mb: 4 }}>
            Часто задаваемые вопросы
          </Typography>
          <Typography sx={{ mb: 6, fontSize: 18 }}>
            Ответы на самые популярные вопросы о нашем приложении.
          </Typography>

          <Box sx={{ width: "100%" }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="h6">
                  Как начать использовать приложение?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Зарегистрируйтесь на платформе, создайте свою первую цель,
                  разбейте её на темы и задачи. Начните отслеживать прогресс
                  сразу после создания первой задачи.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography variant="h6">Есть ли бесплатная версия?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Да, базовый тариф абсолютно бесплатный. Он включает создание
                  целей и задач, отслеживание прогресса в процентах и базовую
                  статистику.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography variant="h6">
                  Можно ли использовать приложение для командной работы?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  В премиум версии доступны функции совместной работы: создание
                  общих целей, назначение задач участникам команды и
                  отслеживание общего прогресса.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel4a-content"
                id="panel4a-header"
              >
                <Typography variant="h6">Как отменить подписку?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Вы можете отменить подписку в любое время в настройках
                  аккаунта. Доступ к премиум функциям сохранится до конца
                  оплаченного периода.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel5a-content"
                id="panel5a-header"
              >
                <Typography variant="h6">
                  Синхронизируются ли данные между устройствами?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Да, все ваши данные автоматически синхронизируются между всеми
                  устройствами. Вы можете работать с компьютера, планшета или
                  телефона.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel6a-content"
                id="panel6a-header"
              >
                <Typography variant="h6">
                  Есть ли мобильное приложение?
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Пока мы предлагаем веб-версию, которая отлично работает на
                  мобильных устройствах. Нативные мобильные приложения находятся
                  в разработке.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </Box>

      <Box sx={{ backgroundColor: "#710f6f", py: 8 }}>
        <Container maxWidth="lg" id="contacts">
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{ mb: 6, color: "#fff" }}
          >
            Контакты
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ mb: 8, fontSize: 18, color: "#fff" }}
          >
            Свяжитесь с нами любым удобным способом или оставьте сообщение
          </Typography>

          <Grid container spacing={6}>
            {/* Контактная информация */}
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ color: "#fff" }}>
                  Наши контакты
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mb: 4, color: "#fff", opacity: 0.9 }}
                >
                  Мы всегда готовы ответить на ваши вопросы и помочь с
                  использованием приложения.
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <EmailIcon sx={{ color: "#fff", fontSize: 32 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", textAlign: "left" }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#fff", opacity: 0.8, textAlign: "left" }}
                    >
                      support@trackerapp.ru
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <PhoneIcon sx={{ color: "#fff", fontSize: 32 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", textAlign: "left" }}
                    >
                      Телефон
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#fff", opacity: 0.8, textAlign: "left" }}
                    >
                      +7 (999) 123-45-67
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <LocationOnIcon sx={{ color: "#fff", fontSize: 32 }} />
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "#fff", textAlign: "left" }}
                    >
                      Адрес
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#fff", opacity: 0.8, textAlign: "left" }}
                    >
                      Москва, ул. Примерная, д. 123
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>

            {/* Форма обратной связи */}
            <Grid item xs={12} md={6}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography
                  variant="h4"
                  gutterBottom
                  sx={{ color: "#fff", mb: 3 }}
                >
                  Обратная связь
                </Typography>

                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                >
                  <TextField
                    fullWidth
                    label="Ваше имя"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Тема сообщения"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Сообщение"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    multiline
                    rows={4}
                    variant="outlined"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        "& fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.5)",
                        },
                        "&:hover fieldset": {
                          borderColor: "rgba(255, 255, 255, 0.7)",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#fff",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "rgba(255, 255, 255, 0.7)",
                      },
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<SendIcon />}
                    sx={{
                      backgroundColor: "#fff",
                      color: "#710f6f",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                      py: 1.5,
                    }}
                  >
                    Отправить сообщение
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Дополнительная информация */}
          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#fff" }}>
              Время работы поддержки
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", opacity: 0.8 }}>
              Понедельник - Пятница: 9:00 - 18:00 (МСК)
            </Typography>
            <Typography variant="body1" sx={{ color: "#fff", opacity: 0.8 }}>
              Суббота - Воскресенье: 10:00 - 16:00 (МСК)
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
