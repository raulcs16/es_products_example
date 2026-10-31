import { IncomingMessage, ServerResponse } from "http";

export type IVendorAuthGateway = (
  req: IncomingMessage,
  res: ServerResponse
) => Promise<void>;
