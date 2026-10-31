import express, { Application, Router } from "express";
import { Server as HttpServer } from "http";
import IMiddleWare from "./utils/imiddleware";

export default class App {
  private app: Application;
  private httpServer: HttpServer | null = null;
  constructor(
    readonly port: number,
    readonly cors: IMiddleWare,
    // readonly rateLimiter: IMiddleWare,
    // readonly auditLog: IMiddleWare,
    // readonly accessControl: IMiddleWare,
    readonly authRouter: Router
  ) {
    this.app = express();

    this.app.get("/health", (req, res) => {
      return res.status(200).send("up and running");
    });
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true }));
    // this.app.use(express.static("public"));//folder with public assets
    this.app.use((req, res, next) => this.cors.handle(req, res, next));

    this.app.use((req, res, next) => {
      console.log(req.headers);
      next();
    });
    this.app.use("/api/auth", this.authRouter);
  }
  public start(): void {
    this.httpServer = this.app.listen(this.port, () => {
      console.log("Server Listening on Port", this.port);
    });
  }
  public close(): void {
    if (this.httpServer) {
      this.httpServer.close();
    }
  }
  public application(): Application {
    return this.app;
  }
}
