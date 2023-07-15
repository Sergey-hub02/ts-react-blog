import { Router } from "express";
import UserController from "../controllers/UserController.js";
import AppDataSource from "../data_source.js";

const user_router = Router();
const user_controller = new UserController(AppDataSource);

user_router.post("/", user_controller.create);
user_router.get("/", user_controller.get);

export default user_router;
