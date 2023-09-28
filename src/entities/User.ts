import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  displayName: string;

  @OneToMany(() => Game, (game) => game.createdUser)
  games: Game;
}