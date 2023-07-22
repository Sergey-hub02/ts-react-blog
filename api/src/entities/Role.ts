import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Представляет роль пользователей в системе
 */
@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  public role_id: number;

  @Column()
  public name: string;

  @Column("text")
  public description: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
