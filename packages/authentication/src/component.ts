import { ITokenVerifier } from "./itoken_verifier.js";
import { IVendorAuthGateway } from "./ivendor_auth_gateway.js";

export class AuthComponent {
  constructor(
    readonly vendorGateway: IVendorAuthGateway,
    readonly tokenVerifier: ITokenVerifier
  ) {}
}
