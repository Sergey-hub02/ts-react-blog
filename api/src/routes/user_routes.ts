import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AppDataSource from "../data_source.js";

const user_router = Router();
const user_controller = new UserController(AppDataSource);

user_router.post("/", user_controller.create);
user_router.get("/", user_controller.get);
user_router.get("/:id", user_controller.get_one);

export default user_router;
