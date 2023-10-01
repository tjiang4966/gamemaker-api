import { SignOptions } from "jsonwebtoken";

export const jwtSignOption: SignOptions = {
  expiresIn: '15s',
  issuer: 'gamemaker',
}