import { jwtSignOption } from "../../config/config";
import { User } from "../../entities/User";
import * as JWT from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();

export function generateAccessToken(user: User) {
  const {id, provider} = user;
  return JWT.sign({id, provider}, process.env.JWT_SECRET as string, jwtSignOption);
}