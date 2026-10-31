import { SessionData } from "./session/entity.js";
import { UserData } from "./user/entity.js";

export type AuthPayload = {
  user: UserData;
  session: SessionData;
};
