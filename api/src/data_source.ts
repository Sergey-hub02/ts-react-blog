import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "./config.js";

import User from "./entities/User.js";
import Role from "./entities/Role.js";
import Category from "./entities/Category.js";
import Comment from "./entities/Comment.js";
import Post from "./entities/Post.js";
import State from "./entities/State.js";

const AppDataSource = new DataSource({
  type: "postgres",
  host: config.DB_HOST,
  port: config.DB_PORT,
  username: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  entities: [User, Role, Category, Comment, Post, State],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log(`[${new Date().toLocaleString()}]: Подключение к базе данных успешно установлено!`);
  })
  .catch((error: Error) => {
    console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
  });

export default AppDataSource;
