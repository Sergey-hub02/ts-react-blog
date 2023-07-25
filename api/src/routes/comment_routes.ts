import { Router } from "express";
import CommentController from "../controllers/CommentController.js";
import AppDataSource from "../data_source.js";

const comment_router = Router();
const comment_controller = new CommentController(AppDataSource);

comment_router.post("/", comment_controller.create);
comment_router.get("/", comment_controller.get);
comment_router.get("/:id", comment_controller.get_one);
comment_router.put("/:id", comment_controller.update);
comment_router.delete("/:id", comment_controller.delete);

export default comment_router;
