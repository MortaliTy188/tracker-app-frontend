import { useState } from "react";
import {
  getUserFullInfo,
  updateUserProfile,
  changePassword,
  uploadAvatar,
} from "../api/userApi";

/**
 * Custom hook for user profile operations
 */
export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  const getFullInfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserFullInfo();
      setProfileData(response.data);
      return {
        success: true,
        data: response.data,
        message: "Profile data loaded successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to load profile data";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUserProfile(profileData);
      return {
        success: true,
        data: response.data,
        message: response.message || "Profile updated successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update profile";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (passwordData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await changePassword(passwordData);
      return {
        success: true,
        data: response.data,
        message: response.message || "Password changed successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to change password";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateAvatar = async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await uploadAvatar(file);
      return {
        success: true,
        data: response.data,
        message: response.message || "Avatar uploaded successfully",
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to upload avatar";
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
    getFullInfo,
    updateProfile,
    updatePassword,
    updateAvatar,
    profileData,
    isLoading,
    error,
  };
};
