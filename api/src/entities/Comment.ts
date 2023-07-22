import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import User from "./User.js";
import Post from "./Post.js";

/**
 * Представляет комментарий к публикации
 */
@Entity()
export default class Comment {
  @PrimaryGeneratedColumn()
  public comment_id: number;

  @Column("text")
  public content: string;

  @OneToOne(() => User)
  @JoinColumn()
  public author: User;

  @ManyToOne(() => Post, (post) => post.comments)
  public post: Post;

  @Column("bool")
  public active: boolean;

  @CreateDateColumn()
  public created_at: Date;

  @UpdateDateColumn()
  public updated_at: Date;
}
