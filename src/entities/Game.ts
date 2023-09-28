import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { GameStatusEnum } from "../classes/Enums";

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
}