import React from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  Paper,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
  Pagination,
  Alert,
  LinearProgress,
} from "@mui/material";
import { Notes, Edit } from "@mui/icons-material";

/**
 * Компонент вкладки заметок
 */
export default function NotesTab({
  notes,
  notesLoading,
  notesError,
  notesStats,
  notesSearch,
  onNotesSearchChange,
  notesSortBy,
  onNotesSortByChange,
  notesSortOrder,
  onNotesSortOrderChange,
  filteredNotes,
  paginatedNotes,
  notesPage,
  notesPerPage,
  onNotesPageChange,
  onOpenNoteDialog,
  onDeleteNote,
  formatSafeDate,
}) {
  const { t } = useTranslation();

  if (notesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <LinearProgress sx={{ width: "100%" }} />
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          📝 {t("notes.yourNotes")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<Notes />}
          onClick={() => onOpenNoteDialog()}
          sx={{ ml: 2 }}
        >
          {t("notes.addNote")}
        </Button>
      </Box>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="primary">
                {notesStats.total || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("profile.notes.stats.total")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="success.main">
                {notesStats.thisWeek || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("profile.notes.stats.thisWeek")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="warning.main">
                {notesStats.thisMonth || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("profile.notes.stats.thisMonth")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ textAlign: "center", p: 2 }}>
            <CardContent>
              <Typography variant="h4" color="info.main">
                {notesStats.averageLength || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t("profile.notes.stats.averageLength")}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t("profile.notes.search")}
              value={notesSearch}
              onChange={(e) => onNotesSearchChange(e.target.value)}
              placeholder={t("notes.searchPlaceholder")}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>{t("common.sort")}</InputLabel>
              <Select
                value={notesSortBy}
                label={t("common.sort")}
                onChange={(e) => onNotesSortByChange(e.target.value)}
              >
                <MenuItem value="date">{t("profile.notes.sort.date")}</MenuItem>
                <MenuItem value="title">
                  {t("profile.notes.sort.title")}
                </MenuItem>
                <MenuItem value="length">
                  {t("profile.notes.sort.length")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <ToggleButtonGroup
              value={notesSortOrder}
              exclusive
              onChange={(e, newOrder) =>
                newOrder && onNotesSortOrderChange(newOrder)
              }
              size="small"
              fullWidth
            >
              <ToggleButton value="desc">
                {t("profile.notes.order.desc")}
              </ToggleButton>
              <ToggleButton value="asc">
                {t("profile.notes.order.asc")}
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
        </Grid>
      </Paper>

      {/* Notes List */}
      {notesError ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {t("notes.loadingError")}: {notesError}
        </Alert>
      ) : filteredNotes.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Notes sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {notesSearch ? t("notes.notFound") : t("notes.noNotesYet")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notesSearch
              ? t("notes.tryChangingSearch")
              : t("notes.createFirstNote")}
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {paginatedNotes.map((note) => (
              <Grid item xs={12} md={6} key={note.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ flexGrow: 1, mr: 2 }}
                      >
                        {note.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={formatSafeDate(
                          note.created_at || note.createdAt
                        )}
                        variant="outlined"
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {note.content && note.content.length > 150
                        ? `${note.content.substring(0, 150)}...`
                        : note.content || t("notes.noContent")}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {note.content ? note.content.length : 0}{" "}
                        {t("notes.characters")}
                      </Typography>
                      {note.topic && (
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Chip
                            label={note.topic.name}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {note.topic.skill && (
                            <Chip
                              label={note.topic.skill.name}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => onOpenNoteDialog(note)}
                    >
                      {t("common.edit")}
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDeleteNote(note.id)}
                    >
                      {t("common.delete")}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {filteredNotes.length > notesPerPage && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredNotes.length / notesPerPage)}
                page={notesPage}
                onChange={onNotesPageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </>
  );
}
