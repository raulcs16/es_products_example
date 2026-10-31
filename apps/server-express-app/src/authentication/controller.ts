import { RequestHandler } from "express";
import { AuthComponent } from "@repo/authentication/component";
import { APIError, APISuccess, HTTP_CODES } from "@repo/utility/http";
import {
  AUTHENTICATION_CODE,
  AUTHENTICATION_ERRORS,
} from "@repo/authentication/errors";
import { AuthPayload } from "@repo/authentication/types";

export default class AuthController {
  constructor(private authComp: AuthComponent) {}
  public handleAuthRequest: RequestHandler = async (req, res, next) => {
    return this.authComp.vendorGateway(req, res);
  };
  public handleSessionRequest: RequestHandler = async (req, res, next) => {
    const payload = await this.authComp.tokenVerifier.getPayload(req.headers);

    if (!payload) {
      const response: APIError<AUTHENTICATION_CODE> = {
        success: false,
        code: AUTHENTICATION_ERRORS.NOT_VERIFIED,
        message: "Unalbe to verify session",
        errors: [],
      };
      res.status(HTTP_CODES.UNAUTHORIZED).json(response);
      return;
    }
    const response: APISuccess<AuthPayload> = {
      success: true,
      data: payload,
      message: "user authenticated",
    };
    res.status(HTTP_CODES.OK).json(response);
    return;
  };
}
