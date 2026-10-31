import { Router } from "express";
import { IRouter } from "../utils/irouter";
import AuthController from "./controller";

export default class AuthRouter implements IRouter {
  private router: Router;
  constructor(private controller: AuthController) {
    this.router = Router();
    this.router.use("/current-session", this.controller.handleSessionRequest);
    this.router.use("/", this.controller.handleAuthRequest);
  }
  public getRouter(): Router {
    return this.router;
  }
}
