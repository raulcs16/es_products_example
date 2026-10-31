export const AUTHENTICATION_ERRORS = {
  NOT_VERIFIED: "AUTHENTICATION_UNVERFIED",
} as const;

export type AUTHENTICATION_CODE =
  (typeof AUTHENTICATION_ERRORS)[keyof typeof AUTHENTICATION_ERRORS];

export class AuthenticationError extends Error {
  constructor(
    public readonly code: AUTHENTICATION_CODE,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AuthenticationError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
