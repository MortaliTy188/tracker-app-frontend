import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";

const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  startAnimation = true,
  onComplete,
  ...typographyProps
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    if (!startAnimation || currentIndex >= text.length) {
      if (currentIndex >= text.length && onComplete) {
        onComplete();
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(currentIndex + 1);
    }, delay + speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, text, speed, delay, startAnimation, onComplete]);

  useEffect(() => {
    if (showCursor) {
      const interval = setInterval(() => {
        setShowCursorBlink((prev) => !prev);
      }, 530);
      return () => clearInterval(interval);
    }
  }, [showCursor]);

  return (
    <Typography {...typographyProps}>
      {displayedText}
      {showCursor && (
        <Box
          component="span"
          sx={{
            opacity: showCursorBlink ? 1 : 0,
            transition: "opacity 0.1s",
            borderRight: "2px solid currentColor",
            paddingRight: "2px",
            marginLeft: "2px",
          }}
        >
          |
        </Box>
      )}
    </Typography>
  );
};

export default TypewriterText;
