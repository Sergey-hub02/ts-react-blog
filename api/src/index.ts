import express from "express";
import config from "./config.js";
import user_router from "./routes/user_routes.js";

const main = async (): Promise<void> => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1/users/", user_router);

  app.listen(config.PORT, () => {
    console.log(`[${new Date().toLocaleString()}]: Приложение запущено на http://localhost:${config.PORT}/`);
  });
}


main()
  .catch((error: Error) => {
    console.error(`[ERROR ${new Date().toLocaleString()}]: ${error.message}`);
  });
