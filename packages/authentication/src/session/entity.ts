import { user_id } from "@repo/utility/id_types";

export type SessionData = {
  token: string;
  expiresAt: Date;
  userId: user_id;
  ipAddress?: string | null | undefined | undefined;
  userAgent?: string | null | undefined | undefined;
};

export type SessionEntry = {
  id: string;
  data: SessionData;
};

export type SessionRecord = {
  entry: SessionEntry;
  createdAt: Date;
  updatedAt: Date;
};
