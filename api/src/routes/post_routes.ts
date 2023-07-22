import { Router } from "express";
import PostController from "../controllers/PostController.js";
import AppDataSource from "../data_source.js";

const post_router = Router();
const post_controller = new PostController(AppDataSource);

post_router.post("/", post_controller.create);
post_router.get("/", post_controller.get);
post_router.get("/:id", post_controller.get_one);
post_router.put("/:id", post_controller.update);
post_router.delete("/:id", post_controller.delete);

export default post_router;
