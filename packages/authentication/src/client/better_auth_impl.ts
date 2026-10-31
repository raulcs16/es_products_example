import { authClient } from "../better_auth/auth-client.js";
import { IAuthClientComp } from "./component.js";
import { AuthPayload } from "../types.js";
import { SessionData } from "../session/entity.js";
import { UserData } from "../user/entity.js";

export default class BetterAuthClient implements IAuthClientComp {
  constructor(
    private logonUrl: string,
    private logoutUrl: string
  ) {}
  public async logout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = this.logoutUrl;
        },
      },
    });
  }
  public async loginWithEmail(
    email: string,
    password: string
  ): Promise<UserData | null> {
    await authClient.signIn.email({ email, password });
    const payload = await this.getAuthPayload();
    return payload ? payload.user : null;
  }
  public async loginWithGoogle() {
    console.log("calling google login");
    await authClient.signIn.social({
      provider: "google",
      callbackURL: this.logonUrl,
    });
  }

  public async getAuthPayload(): Promise<AuthPayload | null> {
    const session = await authClient.getSession();
    if (!session.data) return null;
    return {
      session: session.data.session as SessionData,
      user: session.data.user as UserData,
    };
  }
}
