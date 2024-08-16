import { Express, Router } from "express";
import AuthRoute from "./Auth.route";
import UserRoute from "./User.route";
import TopicRoute from "./Topic.route";
import GroupRoute from "./Group.route";
import PostRoute from "./Post.route";

import Group from "../models/GroupModel";
import Topic from "../models/TopicModel";
import Post from "../models/PostModel";
import User from "../models/UserModel";
import PostPermission from "../models/PostPermissionModel";
import Log from "../models/LogModel";

const router: Router = Router();
const routes = (app: Express): void => {
  router.use("/auth", AuthRoute);
  router.use("/user", UserRoute);
  router.use("/group", GroupRoute);
  router.use("/topic", TopicRoute);
  router.use("/post", PostRoute);

  router.get("/tét", async (req, res) => {
    const post = await Post.findAll();
    const user = await User.findAll();
    const postPermission = await PostPermission.findAll();
    const topic = await Topic.findAll();
    const group = await Group.findAll();
    const log = await Log.findAll();
  });

  app.use("/api", router);
};
export default routes;
