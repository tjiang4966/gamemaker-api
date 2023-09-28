import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "./Game";
import { User } from "./User";
import { RegisterStatusEnum } from "../classes/Enums";

@Entity()
export class GameHasUser {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => User)
  user: User;

  @Column()
  inGameName: string;

  @Column({
    type: 'enum',
    enum: RegisterStatusEnum,
  })
  registerStatus: string;

  @Column('datetime')
  registerDate: Date;
}