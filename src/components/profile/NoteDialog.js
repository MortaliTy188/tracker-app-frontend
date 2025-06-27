import React from "react";
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
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingNote ? "Редактировать заметку" : "Новая заметка"}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Название заметки"
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
          label="Содержание"
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
          <InputLabel>Топик</InputLabel>
          <Select
            value={noteForm.topic_id}
            label="Топик"
            onChange={(e) =>
              onNoteFormChange({
                ...noteForm,
                topic_id: e.target.value,
              })
            }
            disabled={topicsLoading}
          >
            {topicsLoading ? (
              <MenuItem disabled>Загрузка топиков...</MenuItem>
            ) : topicsError ? (
              <MenuItem disabled>Ошибка загрузки топиков</MenuItem>
            ) : topics.length === 0 ? (
              <MenuItem disabled>Нет доступных топиков</MenuItem>
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
        <Button onClick={onClose}>Отмена</Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={
            !noteForm.title.trim() ||
            !noteForm.content.trim() ||
            !noteForm.topic_id
          }
        >
          {editingNote ? "Обновить" : "Создать"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NoteDialog;
