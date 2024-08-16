import * as UserController from "../controllers/User.controller";
import { Router } from "express";
import {
  verifyAccessToken,
  verifyAdmin,
  verifyInfo,
} from "../middlewares/verifyToken";

const route = Router();

route.get("/list/", verifyAdmin, UserController.GetListUser);
route.get("/my-info/", verifyAdmin, UserController.UserDetail);
route.post("/create/", verifyAdmin, UserController.AddNewUser);
route.put("/grant-permission/", verifyAdmin, UserController.GrantPermission);
route.put(
  "/change_password/",
  verifyAccessToken,
  UserController.ChangePassword
);
route.put("/my-info/update/", verifyAccessToken, UserController.UpdateUser);
route.delete("/:id", verifyInfo, UserController.DeleteUser);

export default route;
