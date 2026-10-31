"use client";
import { useAuthController } from "../context/AuthContext";
import LoginBttn from "../imports/LoginBttn";

export default function LoginComponent() {
  const controller = useAuthController();
  return (
    <LoginBttn
      isLoading={false}
      onGoogleLogin={controller.handleGooglLogin}
    ></LoginBttn>
  );
}
