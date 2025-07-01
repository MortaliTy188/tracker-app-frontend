import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const AnimatedCounter = ({
  value,
  duration = 2000,
  startAnimation = false,
  suffix = "",
  ...typographyProps
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    // Извлекаем числовую часть из строки (например, "10,000+" -> 10000)
    const numericValue = parseInt(value.replace(/[^\d]/g, "")) || 0;

    let startTime = null;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      // Используем easing function для более плавной анимации
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOutCubic * numericValue);

      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration, startAnimation]);

  // Форматируем число обратно с суффиксами
  const formatValue = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(".0", "") + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  const formattedValue = startAnimation
    ? formatValue(displayValue) + (value.includes("+") ? "+" : "") + suffix
    : value + suffix;

  return <Typography {...typographyProps}>{formattedValue}</Typography>;
};

export default AnimatedCounter;
