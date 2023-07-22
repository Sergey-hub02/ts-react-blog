import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Представляет категорию публикации
 */
@Entity()
export default class Category {
  @PrimaryGeneratedColumn()
  public category_id: number;

  @Column()
  public name: string;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public update_at: Date;
}
