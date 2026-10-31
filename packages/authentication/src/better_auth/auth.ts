import { betterAuth } from "better-auth";
import getPool from "@repo/config-postgres/getPool";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:8000",
  database: getPool(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  advanced: {
    // Crucial for cross-domain auth (Vercel <-> Firebase)
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: "Lax",
      secure: false,
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  logger: {
    level: "debug",
  },
});
