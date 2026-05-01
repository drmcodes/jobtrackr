import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { RegisterInput, LoginInput, TokenPayload } from "../types/auth.types";

const generateAccessToken = (userId: string): string => {
  return jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" },
  );
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" },
  );
};

export const registerUser = async (input: RegisterInput) => {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new Error("El correo electrónico ya está registrado");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = new User({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email });
  if (!user) {
    throw new Error("Correo electrónico o contraseña inválidos");
  }

  const isValid = await bcrypt.compare(input.password, user.password);
  if (!isValid) {
    throw new Error("Correo electrónico o contraseña inválidos");
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  user.refreshTokens.push(refreshToken);
  await user.save();
};
