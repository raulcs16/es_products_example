import { UserData } from "@repo/authentication/user/entity";

export type AuthState = {
  user: UserData | null;
  logoutError: string;
  loginError: string;
};

export interface IAuthStore {
  getState(): AuthState;
  setState(updater: (prev: AuthState) => AuthState): void;
}
