"use server";

import { AUTHENTICATION_CODE } from "@repo/authentication/errors";
import { AuthPayload } from "@repo/authentication/types";
import { APIError, ApiResponse } from "@repo/utility/http";
import { headers } from "next/headers";

export async function getAuth(): Promise<AuthPayload | null> {
  try {
    const cookieHeader = (await headers()).get("cookie") || "";
    const url = "http://localhost:8000/api/auth/session";
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
    });
    const apiResponse = (await resp.json()) as ApiResponse<AuthPayload>;
    if (!apiResponse.success) {
      const error = apiResponse as APIError<AUTHENTICATION_CODE>;
      console.log(error.code);
      return null;
    }
    return apiResponse.data;
  } catch (err) {
    console.log(err);
    return null;
  }
}
