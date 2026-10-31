import { AuthPayload } from "../types.js";
import { UserData } from "../user/entity.js";

export interface IAuthClientComp {
  loginWithEmail(email: string, pass: string): Promise<UserData | null>;
  loginWithGoogle(): Promise<void>;
  logout(): Promise<void>;
  getAuthPayload(): Promise<AuthPayload | null>;
}
