// src/Utils/errorHandler.ts

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Terjadi kesalahan sistem",
): string {
  if (!error) return fallbackMessage;

  if (typeof error === "string") return error;

  const err = error as Record<string, any>;

  if (err.isValidationError && err.validationErrors) {
    const firstField = Object.keys(err.validationErrors)[0];
    if (firstField && err.validationErrors[firstField]) {
      return err.validationErrors[firstField];
    }
  }

  if (err.allErrors && Array.isArray(err.allErrors) && err.allErrors.length > 0) {
    return err.allErrors[0];
  }

  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.message && typeof err.message === "string") {
    return err.message;
  }

  return fallbackMessage;
}
