import express from "express";
import config from "./config.js";

import user_router from "./routes/user_routes.js";
import post_router from "./routes/post_routes.js";
import comment_router from "./routes/comment_routes.js";

const main = async (): Promise<void> => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/users/", user_router);
  app.use("/api/v1/posts/", post_router);
  app.use("/api/v1/comments/", comment_router);

  app.listen(config.PORT, () => {
    console.log(`[${new Date().toLocaleString()}]: Приложение запущено на http://localhost:${config.PORT}/`);
  });
}


main()
  .catch((error: Error) => {
    console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
  });
