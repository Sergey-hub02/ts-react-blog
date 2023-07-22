import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";

import User from "./User.js";
import Category from "./Category.js";
import Comment from "./Comment.js";
import State from "./State.js";

/**
 * Представляет публикацию пользователя
 */
@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  public post_id: number;

  @Column()
  public title: string;

  @Column("text")
  public content: string;

  @ManyToOne(() => User)
  public author: User;

  @ManyToMany(() => Category)
  @JoinTable()
  public categories: Category[];

  @OneToMany(() => Comment, (comment) => comment.post)
  public comments: Comment[];

  @ManyToOne(() => State)
  public state: State;

  @Column("int")
  public views: number;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
