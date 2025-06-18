import { useState } from "react";
import { loginUser, registerUser } from "../api/userApi";

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
      const response = await loginUser(credentials);

      const token = response.data.token;
      const user = response.data.user;

      if (token) {
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("user", JSON.stringify(user));
        }
      }

      return {
        success: true,
        data: response,
        message: response.message || "Login successful!",
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
      const response = await registerUser(userData);

      const token = response.data?.token;

      if (token) {
        sessionStorage.setItem("token", token);
      }

      return {
        success: true,
        data: response,
        message: response.message || "Registration successful!",
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
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const isAuthenticated = () => {
    return !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
  };

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  const getUser = () => {
    const userStr =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  };

  return {
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated,
    getToken,
    getUser,
  };
};
