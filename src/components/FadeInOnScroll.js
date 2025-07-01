import React, { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";

const FadeInOnScroll = ({
  children,
  delay = 0,
  direction = "up", // up, down, left, right
  duration = 0.6,
  threshold = 0.1,
  ...boxProps
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      { threshold }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, threshold]);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";

    switch (direction) {
      case "up":
        return "translate3d(0, 50px, 0)";
      case "down":
        return "translate3d(0, -50px, 0)";
      case "left":
        return "translate3d(50px, 0, 0)";
      case "right":
        return "translate3d(-50px, 0, 0)";
      default:
        return "translate3d(0, 50px, 0)";
    }
  };

  return (
    <Box
      ref={elementRef}
      sx={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
        willChange: "transform, opacity",
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default FadeInOnScroll;
