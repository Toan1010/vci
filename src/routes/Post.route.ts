import * as PostController from "../controllers/Post.controller";
import { Router } from "express";

const route = Router();

route.get("/list/", PostController.GetListPost);
route.get("/:slug", PostController.DetailPost);
route.post("/create/", PostController.AddNewPost);
route.put("/:id", PostController.UpdatePost);
route.delete("/:id", PostController.DeletePost);

export default route;
