"use client";
import { createContext, useContext, useRef, useState } from "react";
import { AuthState, IAuthStore } from "./store";
import { AuthController } from "./controller";
import { UserData } from "@repo/authentication/user/entity";
import BetterAuthClient from "@repo/authentication/client/better_auth_impl";

const AuthContext = createContext<{
  state: AuthState;
  controller: AuthController;
} | null>(null);

interface AuthContextProps {
  children: React.ReactNode;
  user: UserData | null;
}

export function AuthContextProvider(props: AuthContextProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: props.user,
    logoutError: "",
    loginError: "",
  });

  const stateRef = useRef(authState);
  stateRef.current = authState;

  const authController = useRef<AuthController | null>(null);
  if (!authController.current) {
    const store: IAuthStore = {
      getState: () => stateRef.current,
      setState: setAuthState,
    };
    const baseUrl = process.env.DOMAIN_URL;
    const authClient = new BetterAuthClient(`${baseUrl}/main`, `${baseUrl}`);
    authController.current = new AuthController(store, authClient);
  }
  const controller = authController.current;
  return (
    <AuthContext.Provider value={{ state: authState, controller }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuthState() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthStore must be inside AuthContextProvider");
  return context.state;
}
export function useAuthController(): AuthController {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthController must be inside AuthProvider");
  return context.controller;
}
