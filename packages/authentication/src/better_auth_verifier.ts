import { IncomingHttpHeaders } from "http";
import { ITokenVerifier } from "./itoken_verifier.js";
import { auth } from "./better_auth/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { SessionData } from "./session/entity.js";
import { UserData } from "./user/entity.js";
import { AuthPayload } from "./types.js";

export class BetterAuthTokenVerifier implements ITokenVerifier {
  public async getPayload(
    headers: IncomingHttpHeaders
  ): Promise<AuthPayload | null> {
    const response = await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
    if (!response || !response.session) return null;
    return {
      session: response.session as SessionData,
      user: response.user as UserData,
    };
  }
}
