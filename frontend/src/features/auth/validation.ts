export interface RegisterValidationInput {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateRegister(
  data: RegisterValidationInput
): RegisterErrors {
  const errors: RegisterErrors = {};

  if (!data.email) {
    errors.email = "Email is required";
  } else {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.email)) {
      errors.email = "Invalid email format";
    }
  }

  if (!data.username) {
    errors.username = "Nickname is required";
  } else if (data.username.length < 3) {
    errors.username = "Nickname must be at least 3 characters";
  } else if (data.username.length > 20) {
    errors.username = "Nickname must be under 20 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
    errors.username =
      "Only letters, numbers and underscores allowed";
  }

  if (!data.password) {
    errors.password = "Password is required";
  } else {
    if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(data.password)) {
      errors.password = "Must contain at least one uppercase letter";
    } else if (!/[0-9]/.test(data.password)) {
      errors.password = "Must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
      errors.password = "Must contain at least one special character";
    }
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}