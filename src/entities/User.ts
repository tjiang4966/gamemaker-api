import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { GameHasUser } from "./GameHasUser";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @OneToMany(() => Game, (game) => game.createdUser)
  games: Game;

  @Column()
  googleId: string;

  @Column()
  provider: string;

  @OneToMany(() => GameHasUser, (gameHasUser) => gameHasUser.user)
  gameHasUser: GameHasUser[];
}