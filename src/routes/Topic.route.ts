import * as TopicController from "../controllers/Topic.controller";
import { Router } from "express";
import { verifyAccessToken, verifyAdmin } from "../middlewares/verifyToken";

const route = Router();

route.get("/list/", verifyAccessToken, TopicController.GetListTopic);
route.get("/post/:slug", verifyAccessToken, TopicController.ListTopicPost);
route.post("/create/", verifyAdmin, TopicController.AddNewTopic);
route.put("/:id", verifyAdmin, TopicController.UpdateTopic);
route.delete("/:id", verifyAdmin, TopicController.DeleteTopic);

export default route;
