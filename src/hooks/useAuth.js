import { useState } from "react";
import axios from "axios";

/**
 * Custom hook for authentication logic
 */
export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (credentials, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/login",
        credentials
      );

      const token = response.data.data.token;

      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
        } else {
          sessionStorage.setItem("token", token);
        }
      }

      return {
        success: true,
        data: response.data,
        message: "Login successful!",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);

    // Basic validation
    if (userData.password && userData.password.length < 6) {
      const errorMessage = "Password must be at least 6 characters";
      setError(errorMessage);
      setIsLoading(false);
      return {
        success: false,
        message: errorMessage,
      };
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        userData
      );

      const token = response.data.data.token;

      if (token) {
        sessionStorage.setItem("token", token);
      }

      return {
        success: true,
        data: response.data,
        message: "Registration successful!",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  const isAuthenticated = () => {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  };

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
  };
};
