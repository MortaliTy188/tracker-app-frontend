import { useState } from "react";
import { sendFeedback, getAllFeedback } from "../api/feedbackApi";

/**
 * Custom hook for feedback operations
 */
export const useFeedback = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitFeedback = async (feedbackData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendFeedback(feedbackData);
      return {
        success: true,
        data: response,
        message: response.message || "Feedback sent successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send feedback";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getFeedbackList = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getAllFeedback();
      return {
        success: true,
        data: response.data || response,
        message: "Feedback loaded successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load feedback";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    submitFeedback,
    getFeedbackList,
    isLoading,
    error,
  };
};
