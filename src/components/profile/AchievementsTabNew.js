import React from "react";
import {
  Grid,
  Typography,
  LinearProgress,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { EmojiEvents, FilterList } from "@mui/icons-material";
import AchievementCard from "./AchievementCard";
import AchievementFilters from "./AchievementFilters";

/**
 * Компонент вкладки достижений
 */
export default function AchievementsTab({
  achievements,
  stats,
  achievementsLoading,
  achievementsError,
  achievementFilter,
  categoryFilter,
  rarityFilter,
  onAchievementFilterChange,
  onCategoryFilterChange,
  onRarityFilterChange,
  getFilteredAchievements,
  getUniqueCategories,
  getUniqueRarities,
  translateCategory,
  translateRarity,
  formatSafeDate,
}) {
  if (achievementsLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        🏆 Ваши достижения
      </Typography>

      {/* Filters and Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Filters Section - Left Side */}
        <Grid item xs={12} md={4}>
          <AchievementFilters
            achievementFilter={achievementFilter}
            categoryFilter={categoryFilter}
            rarityFilter={rarityFilter}
            onAchievementFilterChange={onAchievementFilterChange}
            onCategoryFilterChange={onCategoryFilterChange}
            onRarityFilterChange={onRarityFilterChange}
            getUniqueCategories={getUniqueCategories}
            getUniqueRarities={getUniqueRarities}
            translateCategory={translateCategory}
            translateRarity={translateRarity}
          />
        </Grid>

        {/* Statistics Section - Right Side */}
        {stats && (
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Общая статистика
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.completedAchievements}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Получено
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.totalAchievements}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Всего
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="secondary">
                      {stats.earnedPoints}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Очки
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {Math.round(stats.completionRate)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Прогресс
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>

      {/* Results Summary */}
      {Array.isArray(achievements) && achievements.length > 0 && (
        <Box
          sx={{
            mb: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            Показано {getFilteredAchievements().length} из {achievements.length}{" "}
            достижений
          </Typography>
        </Box>
      )}

      {/* Achievements Grid */}
      <Grid container spacing={3}>
        {Array.isArray(achievements) &&
          getFilteredAchievements().map((achievement) => (
            <Grid item xs={12} md={4} key={achievement.id}>
              <AchievementCard
                achievement={achievement}
                translateCategory={translateCategory}
                translateRarity={translateRarity}
                formatSafeDate={formatSafeDate}
              />
            </Grid>
          ))}
      </Grid>

      {/* Error Display */}
      {achievementsError && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {achievementsError}
        </Alert>
      )}

      {/* Empty state for no achievements at all */}
      {Array.isArray(achievements) &&
        achievements.length === 0 &&
        !achievementsLoading && (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <EmojiEvents sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Достижения пока не загружены
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Начните использовать приложение, чтобы получить свои первые
              достижения!
            </Typography>
          </Box>
        )}

      {/* Empty state for filtered out achievements */}
      {Array.isArray(achievements) &&
        achievements.length > 0 &&
        getFilteredAchievements().length === 0 &&
        !achievementsLoading && (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <FilterList sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Нет достижений по выбранным фильтрам
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Попробуйте изменить условия фильтрации
            </Typography>
          </Box>
        )}
    </>
  );
}
