import React from "react";
import { Box } from "@mui/material";

const AnimatedBox = ({
  children,
  animation = "fadeIn",
  duration = "1s",
  delay = "0s",
  infinite = false,
  ...boxProps
}) => {
  const getAnimation = () => {
    const infiniteStyle = infinite ? "infinite" : "";

    switch (animation) {
      case "pulse":
        return {
          animation: `pulse ${duration} ease-in-out ${delay} ${infiniteStyle}`,
          "@keyframes pulse": {
            "0%": {
              transform: "scale(1)",
            },
            "50%": {
              transform: "scale(1.05)",
            },
            "100%": {
              transform: "scale(1)",
            },
          },
        };
      case "float":
        return {
          animation: `float ${duration} ease-in-out ${delay} ${infiniteStyle}`,
          "@keyframes float": {
            "0%": {
              transform: "translateY(0px)",
            },
            "50%": {
              transform: "translateY(-10px)",
            },
            "100%": {
              transform: "translateY(0px)",
            },
          },
        };
      case "bounce":
        return {
          animation: `bounce ${duration} ease-in-out ${delay} ${infiniteStyle}`,
          "@keyframes bounce": {
            "0%, 20%, 53%, 80%, 100%": {
              transform: "translate3d(0,0,0)",
            },
            "40%, 43%": {
              transform: "translate3d(0, -20px, 0)",
            },
            "70%": {
              transform: "translate3d(0, -10px, 0)",
            },
            "90%": {
              transform: "translate3d(0, -4px, 0)",
            },
          },
        };
      default:
        return {
          animation: `fadeIn ${duration} ease-in-out ${delay}`,
          "@keyframes fadeIn": {
            "0%": {
              opacity: 0,
            },
            "100%": {
              opacity: 1,
            },
          },
        };
    }
  };

  return (
    <Box
      sx={{
        ...getAnimation(),
        ...boxProps.sx,
      }}
      {...boxProps}
    >
      {children}
    </Box>
  );
};

export default AnimatedBox;
