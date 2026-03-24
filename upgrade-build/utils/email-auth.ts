import crypto from "crypto";

interface User {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
}

// In-memory database fallback (will be synced with localStorage)
let usersDatabase: User[] = [
  {
    id: "demo-001",
    email: "demo@gmail.com",
    name: "Demo User",
    passwordHash: hashPassword("demo123"),
    createdAt: new Date().toISOString(),
  },
  {
    id: "test-001",
    email: "test@gmail.com",
    name: "Test User",
    passwordHash: hashPassword("test123"),
    createdAt: new Date().toISOString(),
  },
];

// Simple hash function (use bcryptjs in production)
export function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "auristra26salt").digest("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function findUserByEmail(email: string): User | undefined {
  return usersDatabase.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(email: string, password: string, name: string): User {
  // Check if user exists
  if (findUserByEmail(email)) {
    throw new Error("User already exists");
  }

  // Validate email
  if (!email.includes("@")) {
    throw new Error("Invalid email address");
  }

  // Validate password
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  // Validate name
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: email.toLowerCase(),
    name: name.trim(),
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  usersDatabase.push(newUser);
  return newUser;
}

export function authenticateUser(email: string, password: string): User | null {
  const user = findUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return null;
  }
  return user;
}

export function getOrCreateGoogleUser(email: string, name: string, image?: string): User {
  let user = findUserByEmail(email);

  if (!user) {
    user = {
      id: `google-${Date.now()}`,
      email: email.toLowerCase(),
      name: name || "Google User",
      passwordHash: "", // No password for OAuth users
      createdAt: new Date().toISOString(),
    };
    usersDatabase.push(user);
  }

  return user;
}
