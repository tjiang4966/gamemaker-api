import { SignOptions } from "jsonwebtoken";

export const jwtSignOption: SignOptions = {
  expiresIn: '1h',
  issuer: 'gamemaker',
}