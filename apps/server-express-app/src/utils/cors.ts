import { Request, Response, NextFunction } from "express";
import IMiddleWare from "./imiddleware";

export type CorsRules = Record<string, string[]>; // e.g. { "http://localhost:3000": ["GET", "POST", "OPTIONS"] }

export class CORS implements IMiddleWare {
  private allowedOrigins: CorsRules;
  private defaultHeaders: string[];

  constructor(origins: CorsRules, allowedHeaders?: string[]) {
    this.allowedOrigins = origins;
    // Default headers required for Better Auth and credentialed requests
    this.defaultHeaders = allowedHeaders || [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Cookie",
    ];
  }

  public handle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    const origin = req.headers.origin;

    // 1. Non-browser / server-to-server requests
    if (!origin) {
      return next();
    }

    // 2. Check permitted origin & methods
    const allowedMethods = this.getAllowedMethods(origin);

    if (allowedMethods) {
      this.setCorsHeaders(req, res, origin, allowedMethods);

      // 3. Handle OPTIONS Preflight Requests correctly
      if (req.method === "OPTIONS") {
        const requestedMethod = req.headers[
          "access-control-request-method"
        ] as string;

        if (
          requestedMethod &&
          !this.isMethodAllowed(allowedMethods, requestedMethod)
        ) {
          res.status(405).json({
            message: `Method ${requestedMethod} not permitted for origin ${origin}`,
          });
          return; // CRITICAL: End response cycle
        }

        // CRITICAL FIX: Send status 204 or 200 immediately AND return.
        // DO NOT call next() on OPTIONS requests!
        res.status(204).end();
        return;
      }

      // For standard HTTP requests (GET, POST, etc.), move to the next middleware
      next();
    } else {
      // Deny origin
      res.status(403).json({
        message: `Access denied by CORS policy for ${origin}`,
      });
      return;
    }
  };

  /**
   * Helper to retrieve permitted methods for an origin (or wildcard)
   */
  private getAllowedMethods(origin: string): string[] | null {
    if (this.allowedOrigins[origin]) {
      return this.allowedOrigins[origin];
    }
    if (this.allowedOrigins["*"]) {
      return this.allowedOrigins["*"];
    }
    return null;
  }

  /**
   * Inject CORS headers into Response
   */
  private setCorsHeaders(
    req: Request,
    res: Response,
    origin: string,
    methods: string[]
  ): void {
    // 1. Allow credentials (cookies, authorization headers)
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");

    // 2. Dynamically reflect requested headers or fallback to defaults
    const requestedHeaders = req.headers["access-control-request-headers"];
    if (requestedHeaders) {
      res.header("Access-Control-Allow-Headers", requestedHeaders);
    } else {
      res.header(
        "Access-Control-Allow-Headers",
        this.defaultHeaders.join(", ")
      );
    }

    // 3. Expose Set-Cookie header so client browsers process session cookies
    // res.header("Access-Control-Expose-Headers", "Set-Cookie");
    res.header("Access-Control-Allow-Methods", methods.join(", "));
    res.header("Access-Control-Max-Age", "86400"); // 24hr cache
    res.header("Vary", "Origin");
  }

  private isMethodAllowed(allowedMethods: string[], method: string): boolean {
    const upperMethod = method.toUpperCase();
    return allowedMethods.some(
      (m) => m.toUpperCase() === upperMethod || m === "*"
    );
  }
}
