import { useState, useCallback } from "react";

/**
 * Custom hook for managing form data and basic validation
 * @param {Object} initialValues
 * @param {Function} onSubmit -
 * @param {Function} validate -
 */
export const useForm = (initialValues, onSubmit, validate) => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (prev[name]) {
        return {
          ...prev,
          [name]: "",
        };
      }
      return prev;
    });
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      if (event && event.preventDefault) {
        event.preventDefault();
      }
      setIsSubmitting(true);

      if (validate) {
        const validationErrors = validate(formData);
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsSubmitting(false);
          return;
        }
      }

      try {
        await onSubmit(formData);
        setFormData(initialValues);
        setErrors({});
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, onSubmit, initialValues]
  );

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
    setFormData,
    setErrors,
  };
};
