import React from "react";
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
        <Typography variant="h6">Фильтры</Typography>
      </Box>

      {/* Completion Status Filter */}
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <InputLabel>Статус выполнения</InputLabel>
        <Select
          value={achievementFilter}
          label="Статус выполнения"
          onChange={(e) => onAchievementFilterChange(e.target.value)}
        >
          <MenuItem value="all">Все достижения</MenuItem>
          <MenuItem value="completed">
            <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
            Выполненные
          </MenuItem>
          <MenuItem value="incomplete">
            <RadioButtonUnchecked sx={{ mr: 1, fontSize: 18 }} />В процессе
          </MenuItem>
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

      {/* Active Filters Summary */}
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
      {hasActiveFilters && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={resetAllFilters}
        >
          Сбросить все фильтры
        </Button>
      )}
    </Paper>
  );
};

export default AchievementFilters;
