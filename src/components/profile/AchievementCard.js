import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Box,
} from "@mui/material";

const AchievementCard = ({
  achievement,
  translateCategory,
  translateRarity,
  formatSafeDate,
}) => {
  return (
    <Card
      sx={{
        textAlign: "center",
        p: 2,
        position: "relative",
        height: 312,
        minWidth: 310,
        display: "flex",
        flexDirection: "column",
        backgroundColor: achievement.isCompleted
          ? "rgba(46, 125, 50, 0.05)"
          : "rgba(158, 158, 158, 0.05)",
        borderLeft: achievement.isCompleted
          ? "4px solid #2e7d32"
          : "4px solid #9e9e9e",
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Achievement Icon */}
        <Box
          sx={{
            height: 80,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <span
            style={{
              fontSize: "60px",
              filter: achievement.isCompleted ? "none" : "grayscale(100%)",
              opacity: achievement.isCompleted ? 1 : 0.6,
            }}
          >
            {achievement.icon}
          </span>
        </Box>

        {/* Achievement Name */}
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            color: achievement.isCompleted ? "success.main" : "text.secondary",
            fontWeight: achievement.isCompleted ? 600 : 400,
          }}
        >
          {achievement.name}
        </Typography>

        {/* Category and Rarity chips */}
        <Box
          sx={{
            mb: 2,
            display: "flex",
            gap: 1,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {achievement.category && (
            <Chip
              label={translateCategory(achievement.category)}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {achievement.rarity && (
            <Chip
              label={translateRarity(achievement.rarity)}
              size="small"
              variant="outlined"
              color={
                achievement.rarity === "legendary"
                  ? "error"
                  : achievement.rarity === "epic"
                  ? "warning"
                  : achievement.rarity === "rare"
                  ? "info"
                  : "default"
              }
            />
          )}
        </Box>

        {/* Achievement Description */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            flexGrow: 1,
            color: achievement.isCompleted ? "text.primary" : "text.secondary",
          }}
        >
          {achievement.description}
        </Typography>

        {/* Status and Progress */}
        <Box sx={{ mt: "auto" }}>
          {achievement.isCompleted ? (
            <>
              <Chip
                label={`Получено! +${achievement.points} очков`}
                color="success"
                size="small"
                sx={{ mb: 1 }}
              />
              {achievement.earnedAt && (
                <Typography
                  variant="caption"
                  color="success.main"
                  display="block"
                >
                  {formatSafeDate(achievement.earnedAt)}
                </Typography>
              )}
            </>
          ) : (
            <>
              <Chip
                label={`${achievement.progress?.current || 0}/${
                  achievement.progress?.target || achievement.condition_value
                }`}
                color="default"
                size="small"
                sx={{ mb: 1 }}
              />
              <LinearProgress
                variant="determinate"
                value={achievement.percentage || 0}
                sx={{
                  mt: 1,
                  borderRadius: 1,
                  "& .MuiLinearProgress-bar": {
                    backgroundColor:
                      achievement.percentage > 50
                        ? "warning.main"
                        : "info.main",
                  },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ mt: 0.5, display: "block" }}
              >
                {achievement.percentage || 0}% завершено
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AchievementCard;
