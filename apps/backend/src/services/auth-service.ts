import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { AuthPayload, AuthSession } from "../../../../shared/domain.js";
import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

const jwtOptions: SignOptions = {
  expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"]
};

function toSession(user: {
  id: string;
  name: string;
  email: string;
  role: { name: string; permissions: unknown };
}): AuthSession {
  const permissions = Array.isArray(user.role.permissions) ? (user.role.permissions as string[]) : [];

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role.name,
      permissions
    },
    env.jwtSecret,
    jwtOptions
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.name as AuthSession["user"]["role"],
      permissions
    }
  };
}

export class AuthService {
  async login(payload: AuthPayload): Promise<AuthSession | null> {
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { role: true }
    });

    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return toSession(user);
  }

  async getSession(userId: string): Promise<AuthSession | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { role: true }
    });

    if (!user) {
      return null;
    }

    return toSession(user);
  }
}
