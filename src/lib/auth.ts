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

function getSafeUsersFilePath(): string | null {
  try {
    const isVercel = process.env.VERCEL === '1';
    const baseDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    if (!fs.existsSync(baseDir)) {
      fs.mkdirSync(baseDir, { recursive: true });
    }
    return path.join(baseDir, 'users.json');
  } catch {
    return null;
  }
}

let inMemoryUsers: ZUser[] = [
  {
    id: "usr_founder_001",
    name: "Founder",
    email: ADMIN_EMAIL,
    createdAt: new Date().toISOString(),
    role: "founder",
  }
];

export function getAllUsers(): ZUser[] {
  try {
    const filePath = getSafeUsersFilePath();
    if (filePath && fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryUsers = parsed;
        return parsed;
      }
    }
    return inMemoryUsers;
  } catch (err) {
    return inMemoryUsers;
  }
}

export function saveUser(user: ZUser): void {
  const users = [...getAllUsers()];
  const existingIdx = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  inMemoryUsers = users;

  try {
    const filePath = getSafeUsersFilePath();
    if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Could not persist users to disk, stored in memory cache:", err);
  }
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
