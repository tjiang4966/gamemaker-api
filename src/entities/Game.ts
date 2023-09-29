import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { GameStatusEnum } from "../classes/Enums";
import { GameHasUser } from "./GameHasUser";

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('datetime')
  createdDate: Date;

  @Column('datetime')
  gameStart: Date;
  
  @Column('datetime')
  gameEnd: Date;

  @Column('datetime')
  registerDueDate: Date;

  @Column({
    type: 'enum',
    enum: GameStatusEnum,
    default: GameStatusEnum.REGISTING,
  })
  status: string;

  @Column('smallint', {
    default: 0
  })
  deleted: number;

  @Column()
  price: number;

  @Column()
  location: string;

  @Column('int')
  spots: number;

  @ManyToOne(() => User, (user) => user.games)
  createdUser: User;

  @OneToMany(() => GameHasUser, (gameHasUser) => gameHasUser.game)
  gameHasUser: GameHasUser[];
}