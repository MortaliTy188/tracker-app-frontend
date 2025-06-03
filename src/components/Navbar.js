import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Button,
  Typography,
} from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#fff", color: "#000", padding: 2 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flex: 1 }}>
            <Button href="#showcase" color="inherit">
              Презентация
            </Button>
            <Button href="#why-choose-us" color="inherit">
              Почему мы
            </Button>
            <Button href="#fast-introduction" color="inherit">
              Знакомство
            </Button>
            <Button href="#what-will-you-get" color="inherit">
              Что вы получите
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            <Typography variant="h2">Tracker App</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Button href="#reviews" color="inherit">
              Отзывы
            </Button>
            <Button href="#prices" color="inherit">
              Цены
            </Button>
            <Button href="#faq" color="inherit">
              Вопросы и ответы
            </Button>
            <Button href="#contacts" color="inherit">
              Контакты
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
