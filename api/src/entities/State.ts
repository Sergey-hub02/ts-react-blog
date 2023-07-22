import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Представляет состояние публикации
 */
@Entity()
export default class State {
  @PrimaryGeneratedColumn()
  public state_id: number;

  @Column()
  public name: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
