import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const NoteDialog = ({
  open,
  onClose,
  editingNote,
  noteForm,
  onNoteFormChange,
  onSave,
  topics,
  topicsLoading,
  topicsError,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingNote
          ? t("profile.notes.dialog.edit")
          : t("profile.notes.dialog.create")}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label={t("profile.notes.dialog.title")}
          variant="outlined"
          value={noteForm.title}
          onChange={(e) =>
            onNoteFormChange({
              ...noteForm,
              title: e.target.value,
            })
          }
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t("profile.notes.dialog.content")}
          variant="outlined"
          value={noteForm.content}
          onChange={(e) =>
            onNoteFormChange({
              ...noteForm,
              content: e.target.value,
            })
          }
          margin="normal"
          multiline
          rows={6}
          required
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>{t("profile.notes.dialog.topic")}</InputLabel>
          <Select
            value={noteForm.topic_id}
            label={t("profile.notes.dialog.topic")}
            onChange={(e) =>
              onNoteFormChange({
                ...noteForm,
                topic_id: e.target.value,
              })
            }
            disabled={topicsLoading}
          >
            {topicsLoading ? (
              <MenuItem disabled>{t("notes.loadingTopics")}</MenuItem>
            ) : topicsError ? (
              <MenuItem disabled>{t("notes.topicsLoadError")}</MenuItem>
            ) : topics.length === 0 ? (
              <MenuItem disabled>{t("notes.noTopicsAvailable")}</MenuItem>
            ) : (
              topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name} ({topic.skill?.name})
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("profile.notes.dialog.cancel")}</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={
            !noteForm.title.trim() ||
            !noteForm.content.trim() ||
            !noteForm.topic_id
          }
        >
          {editingNote ? t("notes.update") : t("notes.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
