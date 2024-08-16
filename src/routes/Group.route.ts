import * as GroupController from "../controllers/Group.controller";
import { Router } from "express";
import { verifyAccessToken, verifyAdmin } from "../middlewares/verifyToken";

const route = Router();

route.get("/list/", verifyAdmin, GroupController.GetListGroup);
route.get("/post/:slug", verifyAccessToken, GroupController.ListGroupPost);
route.post("/create/", verifyAdmin, GroupController.AddNewGroup);
route.put("/:id", verifyAdmin, GroupController.UpdateGroup);
route.delete("/:id", verifyAdmin, GroupController.DeleteGroup);

export default route;
