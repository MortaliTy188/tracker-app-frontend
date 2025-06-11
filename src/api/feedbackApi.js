// API client for feedback operations
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:3001";

/**
 * Send feedback to the server
 * @param {Object} feedbackData
 * @param {string} feedbackData.testName
 * @param {string} feedbackData.email
 * @param {string} feedbackData.subject
 * @param {string} feedbackData.message
 * @returns {Promise<Object>}
 */
export const sendFeedback = async (feedbackData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_name: feedbackData.name,
        user_email: feedbackData.email,
        email_theme: feedbackData.subject,
        message: feedbackData.message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending feedback:", error);
    throw error;
  }
};

/**
 * Get all feedback
 * @returns {Promise<Array>}
 */
export const getAllFeedback = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching feedback:", error);
    throw error;
  }
};
