import React from "react";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Language, ExpandMore } from "@mui/icons-material";

const LanguageSwitcher = ({ variant = "select" }) => {
  const { i18n, t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Инициализация языка при монтировании компонента
  React.useEffect(() => {
    const savedLanguage =
      localStorage.getItem("i18nextLng") ||
      sessionStorage.getItem("i18nextLng");
    console.log("LanguageSwitcher mounted, saved language:", savedLanguage);
    console.log("Current i18n language:", i18n.language);

    if (savedLanguage && savedLanguage !== i18n.language) {
      console.log("Setting language to saved:", savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    console.log("Changing language to:", langCode);

    // Меняем язык в i18n
    i18n.changeLanguage(langCode);

    // Сохраняем в обоих местах для надежности
    localStorage.setItem("i18nextLng", langCode);
    sessionStorage.setItem("i18nextLng", langCode);

    // Закрываем меню
    setAnchorEl(null);

    console.log("Language changed to:", langCode);
    console.log("localStorage i18nextLng:", localStorage.getItem("i18nextLng"));
    console.log(
      "sessionStorage i18nextLng:",
      sessionStorage.getItem("i18nextLng")
    );
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (variant === "menu") {
    return (
      <>
        <IconButton
          onClick={handleClick}
          sx={{
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {currentLanguage.flag} {currentLanguage.name}
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: { xs: "block", sm: "none" } }}
          >
            {currentLanguage.flag}
          </Typography>
          <ExpandMore fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {languages.map((language) => (
            <MenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={language.code === i18n.language}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Typography variant="h6">{language.flag}</Typography>
              </ListItemIcon>
              <ListItemText primary={language.name} />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <Select
        value={i18n.language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        startAdornment={<Language sx={{ mr: 1, color: "text.secondary" }} />}
        sx={{
          "& .MuiSelect-select": {
            display: "flex",
            alignItems: "center",
            gap: 1,
          },
        }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>{language.flag}</Typography>
              <Typography>{language.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
