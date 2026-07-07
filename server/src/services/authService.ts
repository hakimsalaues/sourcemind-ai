import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";
import { env } from "../config/env";
import { AppError } from "../utils/AppError";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const createToken = (userId: string) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "7d",
  });
};

const formatUser = (user: IUser) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};

export const authService = {
  async register({ name, email, password }: RegisterInput) {
    if (!name || !email || !password) {
      throw new AppError("Name, email and password are required", 400);
    }

    if (password.length < 6) {
      throw new AppError("Password must be at least 6 characters long", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      throw new AppError("User already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
    });

    const token = createToken(user.id);

    return {
      user: formatUser(user),
      token,
    };
  },

  async login({ email, password }: LoginInput) {
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = createToken(user.id);

    return {
      user: formatUser(user),
      token,
    };
  },
};
