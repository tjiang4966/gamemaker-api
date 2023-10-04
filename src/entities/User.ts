import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { GameHasUser } from "./GameHasUser";
import { IJwtBody } from "../classes/IJwtBody";
declare global {
  namespace Express {
    interface User extends IJwtBody {}
  }
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @Column()
  profilePhoto: string;

  @OneToMany(() => Game, (game) => game.createdUser)
  games: Game;

  @Column()
  googleId: string;

  @Column()
  provider: string;

  @OneToMany(() => GameHasUser, (gameHasUser) => gameHasUser.user)
  gameHasUser: GameHasUser[];
}