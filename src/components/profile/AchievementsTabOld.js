import React from "react";
import {
  Grid,
  Typography,
  LinearProgress,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { EmojiEvents } from "@mui/icons-material";
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

  const resetFilters = () => {
    onAchievementFilterChange("all");
    onCategoryFilterChange("all");
    onRarityFilterChange("all");
  };

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
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Категория</InputLabel>
              <Select
                value={categoryFilter}
                label="Категория"
                onChange={(e) => onCategoryFilterChange(e.target.value)}
              >
                <MenuItem value="all">Все категории</MenuItem>
                {getUniqueCategories().map((category) => (
                  <MenuItem key={category} value={category}>
                    {translateCategory(category)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rarity Filter */}
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Редкость</InputLabel>
              <Select
                value={rarityFilter}
                label="Редкость"
                onChange={(e) => onRarityFilterChange(e.target.value)}
              >
                <MenuItem value="all">Любая редкость</MenuItem>
                {getUniqueRarities().map((rarity) => (
                  <MenuItem key={rarity} value={rarity}>
                    {translateRarity(rarity)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Active Filters Display */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {achievementFilter !== "all" && (
                <Chip
                  label={`Статус: ${
                    achievementFilter === "completed" ? "Выполненные" : "В процессе"
                  }`}
                  onDelete={() => onAchievementFilterChange("all")}
                  color="primary"
                  size="small"
                />
              )}
              {categoryFilter !== "all" && (
                <Chip
                  label={`Категория: ${translateCategory(categoryFilter)}`}
                  onDelete={() => onCategoryFilterChange("all")}
                  color="secondary"
                  size="small"
                />
              )}
              {rarityFilter !== "all" && (
                <Chip
                  label={`Редкость: ${translateRarity(rarityFilter)}`}
                  onDelete={() => onRarityFilterChange("all")}
                  color="info"
                  size="small"
                />
              )}
            </Box>

            {/* Reset Filters Button */}
            {(achievementFilter !== "all" ||
              categoryFilter !== "all" ||
              rarityFilter !== "all") && (
              <Button
                variant="outlined"
                size="small"
                fullWidth
                onClick={resetFilters}
              >
                Сбросить все фильтры
              </Button>
            )}
          </Paper>
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
        <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" color="textSecondary">
            Показано {getFilteredAchievements().length} из {achievements.length} достижений
          </Typography>
          {(achievementFilter !== "all" ||
            categoryFilter !== "all" ||
            rarityFilter !== "all") && (
            <Button size="small" onClick={resetFilters}>
              Сбросить все фильтры
            </Button>
          )}
        </Box>
      )}

      {/* Achievements Grid */}
      <Grid container spacing={3}>
        {Array.isArray(achievements) &&
          getFilteredAchievements().map((achievement) => (
            <Grid item xs={12} md={4} key={achievement.id}>
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
                          label={`${achievement.progress.current}/${achievement.progress.target}`}
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
                                achievement.percentage > 50 ? "warning.main" : "info.main",
                            },
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: "block" }}
                        >
                          {achievement.percentage}% завершено
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Empty States */}
      {achievementsError && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          {achievementsError}
        </Alert>
      )}

      {Array.isArray(achievements) &&
        achievements.length === 0 &&
        !achievementsLoading && (
          <Box sx={{ textAlign: "center", p: 4 }}>
            <EmojiEvents sx={{ fontSize: 60, color: "grey.400", mb: 2 }} />
            <Typography variant="h6" color="textSecondary">
              Достижения пока не загружены
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Начните использовать приложение, чтобы получить свои первые достижения!
            </Typography>
          </Box>
        )}

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
            <Button variant="outlined" sx={{ mt: 2 }} onClick={resetFilters}>
              Сбросить фильтры
            </Button>
          </Box>
        )}
    </>
  );
}
