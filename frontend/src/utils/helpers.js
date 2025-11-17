export function validateEmail(email) {
  if (!email || typeof email !== "string") {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }

  return ""; // valid
}

export function validatePassword(password) {
  if (!password || typeof password !== "string") {
    return "Password is required";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }

  const strengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  if (!strengthRegex.test(password)) {
    return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
  }

  return ""; // valid
}
