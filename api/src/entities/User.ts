import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import Role from "./Role.js";

/**
 * Представляет пользователя системы
 */
@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public user_id: number;

  @Column()
  public firstname: string;

  @Column()
  public lastname: string;

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @ManyToMany(() => Role)
  @JoinTable()
  public role: Role[];

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
