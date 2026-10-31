import { IAuthClientComp } from "@repo/authentication/client/component";
import { IAuthStore } from "./store";

export class AuthController {
  constructor(
    private store: IAuthStore,
    private authClient: IAuthClientComp
  ) {}

  public handleLogout = async (): Promise<void> => {
    try {
      const _ = await this.authClient.logout();
      this.store.setState((prev) => ({
        ...prev,
        user: null,
      }));
    } catch (err) {
      const error = err as Error;
      this.store.setState((prev) => ({
        ...prev,
        user: null,
        logoutError: error.message,
      }));
    }
  };
  public handleEmailLogin = async (
    email: string,
    pass: string
  ): Promise<void> => {
    try {
      const user = await this.authClient.loginWithEmail(email, pass);
      this.store.setState((prev) => ({
        ...prev,
        user: user,
      }));
    } catch (err) {
      const error = err as Error;
      this.store.setState((prev) => ({
        ...prev,
        user: null,
        loginError: error.message,
      }));
    }
  };
  public handleGooglLogin = async (): Promise<void> => {
    try {
      this.store.setState((prev) => ({
        ...prev,
      }));
      await this.authClient.loginWithGoogle();
    } catch (err) {
      const error = err as Error;
      this.store.setState((prev) => ({
        ...prev,
        user: null,
        loginError: error.message,
      }));
    }
  };
}
