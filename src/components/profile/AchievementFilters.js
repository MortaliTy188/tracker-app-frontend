import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Paper,
} from "@mui/material";
import {
  FilterList,
  CheckCircle,
  RadioButtonUnchecked,
} from "@mui/icons-material";

const AchievementFilters = ({
  achievementFilter,
  categoryFilter,
  rarityFilter,
  onAchievementFilterChange,
  onCategoryFilterChange,
  onRarityFilterChange,
  getUniqueCategories,
  getUniqueRarities,
  translateCategory,
  translateRarity,
}) => {
  const { t } = useTranslation();

  const hasActiveFilters =
    achievementFilter !== "all" ||
    categoryFilter !== "all" ||
    rarityFilter !== "all";

  const resetAllFilters = () => {
    onAchievementFilterChange("all");
    onCategoryFilterChange("all");
    onRarityFilterChange("all");
  };

  return (
    <Paper sx={{ p: 3, height: "fit-content" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <FilterList sx={{ mr: 1 }} />
        <Typography variant="h6">{t("achievements.filters.title")}</Typography>
      </Box>

      {/* Completion Status Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{t("achievements.filters.completionStatus")}</InputLabel>
        <Select
          value={achievementFilter}
          label={t("achievements.filters.completionStatus")}
          onChange={(e) => onAchievementFilterChange(e.target.value)}
        >
          <MenuItem value="all">
            {t("profile.achievements.filters.all")}
          </MenuItem>
          <MenuItem value="completed">
            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
            {t("profile.achievements.filters.completed")}
          </MenuItem>
          <MenuItem value="incomplete">
            <RadioButtonUnchecked sx={{ mr: 1, fontSize: 18 }} />
            {t("profile.achievements.filters.incomplete")}
          </MenuItem>
        </Select>
      </FormControl>

      {/* Category Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{t("achievements.filters.category")}</InputLabel>
        <Select
          value={categoryFilter}
          label={t("achievements.filters.category")}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
        >
          <MenuItem value="all">
            {t("achievements.filters.allCategories")}
          </MenuItem>
          {getUniqueCategories().map((category) => (
            <MenuItem key={category} value={category}>
              {translateCategory(category)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Rarity Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>{t("achievements.filters.rarity")}</InputLabel>
        <Select
          value={rarityFilter}
          label={t("achievements.filters.rarity")}
          onChange={(e) => onRarityFilterChange(e.target.value)}
        >
          <MenuItem value="all">{t("achievements.filters.anyRarity")}</MenuItem>
          {getUniqueRarities().map((rarity) => (
            <MenuItem key={rarity} value={rarity}>
              {translateRarity(rarity)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Active Filters Summary */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
        {achievementFilter !== "all" && (
          <Chip
            label={`${t("achievements.filters.status")}: ${
              achievementFilter === "completed"
                ? t("profile.achievements.filters.completed")
                : t("profile.achievements.filters.incomplete")
            }`}
            onDelete={() => onAchievementFilterChange("all")}
            color="primary"
            size="small"
          />
        )}
        {categoryFilter !== "all" && (
          <Chip
            label={`${t("achievements.filters.category")}: ${translateCategory(
              categoryFilter
            )}`}
            onDelete={() => onCategoryFilterChange("all")}
            color="secondary"
            size="small"
          />
        )}
        {rarityFilter !== "all" && (
          <Chip
            label={`${t("achievements.filters.rarity")}: ${translateRarity(
              rarityFilter
            )}`}
            onDelete={() => onRarityFilterChange("all")}
            color="info"
            size="small"
          />
        )}
      </Box>

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={resetAllFilters}
        >
          {t("achievements.filters.resetAll")}
        </Button>
      )}
    </Paper>
  );
};

export default AchievementFilters;
