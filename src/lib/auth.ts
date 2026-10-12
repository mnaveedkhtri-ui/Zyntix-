import fs from "fs";
import path from "path";

export interface ZUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  createdAt: string;
  role: "founder" | "member";
}

export const ADMIN_EMAIL = "moderntrendz98@gmail.com";

const USERS_FILE = path.join(process.cwd(), "data", "users.json");

function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

export function getAllUsers(): ZUser[] {
  try {
    if (!fs.existsSync(USERS_FILE)) {
      ensureDirectoryExistence(USERS_FILE);
      const defaultUsers: ZUser[] = [
        {
          id: "usr_founder_001",
          name: "Founder",
          email: ADMIN_EMAIL,
          createdAt: new Date().toISOString(),
          role: "founder",
        }
      ];
      fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf-8");
      return defaultUsers;
    }
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read users file:", err);
    return [
      {
        id: "usr_founder_001",
        name: "Founder",
        email: ADMIN_EMAIL,
        createdAt: new Date().toISOString(),
        role: "founder",
      }
    ];
  }
}

export function saveUser(user: ZUser): void {
  const users = getAllUsers();
  const existingIdx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  ensureDirectoryExistence(USERS_FILE);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
}

export function getUserByEmail(email: string): ZUser | null {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
}

export function getUserById(id: string): ZUser | null {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
}

// Simple base64 session token encode/decode
export function encodeSession(user: { id: string; email: string; name: string; role: string }): string {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
  });
  return Buffer.from(payload).toString("base64");
}

export function decodeSession(token: string): { id: string; email: string; name: string; role: string } | null {
  try {
    const raw = Buffer.from(token, "base64").toString("utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.exp && parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
