export function validateEmail(email: string): string | undefined {
  if (!email) return "Email is required";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Invalid email format";

  return undefined;
}

export function validateUsername(username: string): string | undefined {
  if (!username) return "Nickname is required";
  if (username.length < 3) return "Nickname must be at least 3 characters";
  if (username.length > 20) return "Nickname must be under 20 characters";
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Only letters, numbers and underscores allowed";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Must contain at least one uppercase letter";
  if (!/[0-9]/.test(password)) return "Must contain at least one number";
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Must contain at least one special character";
  return undefined;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | undefined {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return undefined;
}


export interface RegisterValidationInput {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface LoginValidationInput {
  email: string;
  password: string;
}

export interface RegisterErrors {
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
}

export interface LoginErrors {
  email?: string;
  password?: string;
  credentials?: string;
}


export function validateRegister(data: RegisterValidationInput): RegisterErrors {
  const errors: RegisterErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  const usernameError = validateUsername(data.username);
  if (usernameError) errors.username = usernameError;

  const passwordError = validatePassword(data.password);
  if (passwordError) errors.password = passwordError;

  const confirmPasswordError = validateConfirmPassword(data.password, data.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
}

export function validateLogin(data: LoginValidationInput): LoginErrors {
  const errors: LoginErrors = {};

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (!data.password) {
    errors.password = "Password is required";
  }

  return errors;
}