import type { IncomingHttpHeaders } from "http";
import { AuthPayload } from "./types.js";

export interface ITokenVerifier {
  getPayload(headers: IncomingHttpHeaders): Promise<AuthPayload | null>;
}
