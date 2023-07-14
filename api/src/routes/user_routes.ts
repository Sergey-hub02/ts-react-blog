import { Router } from "express";
import UserController from "../controllers/UserController.js";

const user_router = Router();
const user_controller = new UserController();

user_router.post("/", user_controller.create);

export default user_router;
