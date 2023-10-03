import { SignOptions } from "jsonwebtoken";

export const jwtSignOption: SignOptions = {
  expiresIn: '15m',
  issuer: 'gamemaker',
}