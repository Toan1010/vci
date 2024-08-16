import * as AuthController from "../controllers/Auth.controller";
import { Router } from "express";

const route = Router();

route.post("/create/token/", AuthController.Login);
route.post("/refresh/token/", AuthController.RefreshToken);
route.post("/logout/", AuthController.Logout);

export default route;
