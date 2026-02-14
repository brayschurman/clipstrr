// client-side username management utilities

const USERNAME_KEY = "thisonepart_username";

export function getUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

export function setUsername(username: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERNAME_KEY, username);
}

export function clearUsername(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USERNAME_KEY);
}

export function validateUsername(username: string): {
  valid: boolean;
  error?: string;
} {
  if (!username || username.trim().length === 0) {
    return { valid: false, error: "Username is required" };
  }

  if (username.length < 3) {
    return { valid: false, error: "Username must be at least 3 characters" };
  }

  if (username.length > 20) {
    return { valid: false, error: "Username must be 20 characters or less" };
  }

  // allow alphanumeric, spaces, underscores, and hyphens
  if (!/^[a-zA-Z0-9 _-]+$/.test(username)) {
    return {
      valid: false,
      error: "Username can only contain letters, numbers, spaces, underscores, and hyphens",
    };
  }

  return { valid: true };
}
