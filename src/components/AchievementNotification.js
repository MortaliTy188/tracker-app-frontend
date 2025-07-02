import React, { useState, useEffect } from "react";
import {
  Snackbar,
  Alert,
  Box,
  Typography,
  Avatar,
  Slide,
  Paper,
  Grow,
  IconButton,
} from "@mui/material";
import { EmojiEvents, Close, Star, Celebration } from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";

// Анимация для иконки достижения
const celebrationAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.2) rotate(-5deg);
  }
  50% {
    transform: scale(1.3) rotate(5deg);
  }
  75% {
    transform: scale(1.1) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

// Анимация для звезд
const sparkleAnimation = keyframes`
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
`;

// Анимация для появления
const slideInAnimation = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

// Стилизованный контейнер для уведомления
const StyledNotificationPaper = styled(Paper)(({ theme, rarity }) => {
  const getRarityColors = (rarity) => {
    switch (rarity) {
      case "legendary":
        return {
          background: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
          border: "2px solid #FFD700",
          boxShadow: "0 8px 32px rgba(255, 215, 0, 0.4)",
        };
      case "epic":
        return {
          background: "linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)",
          border: "2px solid #9C27B0",
          boxShadow: "0 8px 32px rgba(156, 39, 176, 0.4)",
        };
      case "rare":
        return {
          background: "linear-gradient(135deg, #2196F3 0%, #3F51B5 100%)",
          border: "2px solid #2196F3",
          boxShadow: "0 8px 32px rgba(33, 150, 243, 0.4)",
        };
      default:
        return {
          background: "linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)",
          border: "2px solid #4CAF50",
          boxShadow: "0 8px 32px rgba(76, 175, 80, 0.4)",
        };
    }
  };

  const colors = getRarityColors(rarity);

  return {
    ...colors,
    padding: theme.spacing(2),
    borderRadius: theme.spacing(2),
    color: "white",
    position: "relative",
    overflow: "hidden",
    minWidth: "320px",
    maxWidth: "400px",
    animation: `${slideInAnimation} 0.6s ease-out`,
    "&::before": {
      content: '""',
      position: "absolute",
      top: "-50%",
      left: "-50%",
      width: "200%",
      height: "200%",
      background:
        "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
      animation: `${sparkleAnimation} 2s ease-in-out infinite`,
    },
  };
});

// Стилизованная иконка достижения
const AnimatedAchievementIcon = styled(Avatar)(({ theme }) => ({
  width: 60,
  height: 60,
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  animation: `${celebrationAnimation} 1s ease-in-out`,
  "& .MuiSvgIcon-root": {
    fontSize: "2rem",
    color: "white",
  },
}));

// Компонент звездочек для анимации
const SparkleIcon = styled(Star)(({ delay = 0 }) => ({
  position: "absolute",
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "1rem",
  animation: `${sparkleAnimation} 2s ease-in-out infinite`,
  animationDelay: `${delay}s`,
}));

// Переход для Snackbar
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

/**
 * Компонент уведомления о получении достижения
 */
const AchievementNotification = ({
  open,
  onClose,
  achievement,
  autoHideDuration = 6000,
}) => {
  const [showSparkles, setShowSparkles] = useState(false);

  console.log("🎯 AchievementNotification render:", {
    open,
    achievement: !!achievement,
  });

  useEffect(() => {
    if (open) {
      console.log("✨ Achievement notification opened:", achievement);
      setShowSparkles(true);
      // Убираем звездочки через 3 секунды
      const timer = setTimeout(() => {
        setShowSparkles(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, achievement]);

  if (!achievement) return null;

  const getRarityText = (rarity) => {
    switch (rarity) {
      case "legendary":
        return "Легендарное достижение!";
      case "epic":
        return "Эпическое достижение!";
      case "rare":
        return "Редкое достижение!";
      default:
        return "Новое достижение!";
    }
  };

  const getAchievementIcon = (icon) => {
    // Здесь можно добавить маппинг иконок из базы данных на компоненты MUI
    switch (icon) {
      case "celebration":
        return <Celebration />;
      case "star":
        return <Star />;
      default:
        return <EmojiEvents />;
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={SlideTransition}
      sx={{ mt: 8 }}
    >
      <StyledNotificationPaper rarity={achievement.rarity} elevation={8}>
        {/* Звездочки для анимации */}
        {showSparkles && (
          <>
            <SparkleIcon delay={0} sx={{ top: "10%", right: "20%" }} />
            <SparkleIcon delay={0.5} sx={{ top: "20%", right: "80%" }} />
            <SparkleIcon delay={1} sx={{ top: "70%", right: "15%" }} />
            <SparkleIcon delay={1.5} sx={{ top: "80%", right: "70%" }} />
          </>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Иконка достижения */}
          <AnimatedAchievementIcon>
            {getAchievementIcon(achievement.icon)}
          </AnimatedAchievementIcon>

          {/* Текст уведомления */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                fontSize: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                opacity: 0.9,
                mb: 0.5,
              }}
            >
              {getRarityText(achievement.rarity)}
            </Typography>

            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                mb: 0.5,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {achievement.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                fontSize: "0.85rem",
                lineHeight: 1.3,
              }}
            >
              {achievement.description}
            </Typography>

            {/* Очки за достижение */}
            {achievement.points && (
              <Typography
                variant="caption"
                sx={{
                  display: "block",
                  mt: 1,
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  opacity: 0.8,
                }}
              >
                +{achievement.points} очков
              </Typography>
            )}
          </Box>

          {/* Кнопка закрытия */}
          <IconButton
            onClick={onClose}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </StyledNotificationPaper>
    </Snackbar>
  );
};

export default AchievementNotification;
