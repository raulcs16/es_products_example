import { betterAuthGateway } from "@repo/authentication/better_auth_gateway";
import { BetterAuthTokenVerifier } from "@repo/authentication/better_auth_verifier";
import { AuthComponent } from "@repo/authentication/component";
import AuthController from "./authentication/controller";
import AuthRouter from "./authentication/router";
import { CORS } from "./utils/cors";
import IMiddleWare from "./utils/imiddleware";
import App from "./app";
import PGPool from "@repo/config-postgres/pg_pool";

const client = process.env.CLIENT_DOMAIN_URL || "";
const cors: IMiddleWare = new CORS(
  { [client]: ["GET", "POST", "OPTIONS"] },
  []
);

const pool = new PGPool();
if (!pool.hasConnection()) {
  console.error("DB CONNECTION NOT ESTABLISHED");
}

const tokenVerifier = new BetterAuthTokenVerifier();
const authComp: AuthComponent = new AuthComponent(
  betterAuthGateway,
  tokenVerifier
);

const authController = new AuthController(authComp);
const authRouter = new AuthRouter(authController).getRouter();

const server = new App(8000, cors, authRouter);

server.start();
