import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Grid,
  Typography,
  LinearProgress,
  Box,
  Alert,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  const handleCardClick = (achievement) => {
    setSelectedAchievement(achievement);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedAchievement(null);
  };

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
        🏆 {t("achievements.yourAchievements")}
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
                {t("achievements.generalStats")}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.completedAchievements}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("achievements.completed")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.totalAchievements}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("achievements.total")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="secondary">
                      {stats.earnedPoints}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("achievements.points")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {Math.round(stats.completionRate)}%
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {t("achievements.progress")}
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
            {t("achievements.showing", {
              filtered: getFilteredAchievements().length,
              total: achievements.length,
            })}
          </Typography>
        </Box>
      )}

      {/* Achievements Grid */}
      <Grid container spacing={3} alignItems="stretch">
        {Array.isArray(achievements) &&
          getFilteredAchievements().map((achievement) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={achievement.id}
              sx={{ display: "flex" }}
            >
              <Box sx={{ width: "100%", display: "flex", height: "100%" }}>
                <div
                  style={{ width: "100%", height: "100%" }}
                  onClick={() => handleCardClick(achievement)}
                >
                  <AchievementCard
                    achievement={achievement}
                    translateCategory={translateCategory}
                    translateRarity={translateRarity}
                    formatSafeDate={formatSafeDate}
                    sx={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      minHeight: 320,
                      maxHeight: 340,
                      minWidth: 0,
                      width: "100%",
                      maxWidth: "100%",
                      boxSizing: "border-box",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    hideDescription={true}
                  />
                </div>
              </Box>
            </Grid>
          ))}
      </Grid>
      {/* Модальное окно с подробной информацией */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        {selectedAchievement && (
          <>
            <DialogTitle>{selectedAchievement.name}</DialogTitle>
            <Divider />
            <DialogContent>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <span style={{ fontSize: 60 }}>{selectedAchievement.icon}</span>
              </Box>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                gutterBottom
              >
                {translateCategory(selectedAchievement.category)} |{" "}
                {translateRarity(selectedAchievement.rarity)}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedAchievement.isCompleted
                  ? formatSafeDate(
                      selectedAchievement.earnedAt ||
                        selectedAchievement.achieved_at
                    )
                  : t("achievements.notReceived")}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2, whiteSpace: "pre-line" }}
              >
                {selectedAchievement.description}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>
                {t("common.close", "Закрыть")}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

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
              {t("achievements.notLoaded")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("achievements.startUsing")}
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
              {t("achievements.noAchievementsInFilter")}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {t("achievements.tryChangingFilters")}
            </Typography>
          </Box>
        )}
    </>
  );
}
