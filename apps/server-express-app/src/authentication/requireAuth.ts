import { RequestHandler } from "express";
import { AUTHENTICATION_ERRORS } from "@repo/authentication/errors";
import { ITokenVerifier } from "@repo/authentication/itoken_verifier";
import { user_id } from "@repo/utility/id_types";
import { HTTP_CODES } from "@repo/utility/http";

declare global {
  namespace Express {
    interface Request {
      userId?: user_id;
    }
  }
}

export default function requireAuth(
  tokenVerifier: ITokenVerifier
): RequestHandler {
  return async (req, res, next) => {
    try {
      const payload = await tokenVerifier.getPayload(req.headers);
      if (!payload) {
        res.status(HTTP_CODES.UNAUTHORIZED).json({
          success: false,
          code: AUTHENTICATION_ERRORS.NOT_VERIFIED,
          message: "Authentication required",
        });
        return;
      }
      req.userId = payload.session.userId;
      next();
    } catch (err) {
      next(err);
    }
  };
}
