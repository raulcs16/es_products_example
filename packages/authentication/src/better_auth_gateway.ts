import { toNodeHandler } from "better-auth/node";
import { auth } from "./better_auth/auth.js";
import { IVendorAuthGateway } from "./ivendor_auth_gateway.js";

export const betterAuthGateway: IVendorAuthGateway = (req, res) => {
  return toNodeHandler(auth)(req, res);
};
