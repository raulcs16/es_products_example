"use client";
import { useAuthController, useAuthState } from "../context/AuthContext";
import LogoutBttn from "../imports/LogoutBttn";

export default function LogoutComponent() {
  const controller = useAuthController();
  const { user } = useAuthState();
  if (!user) return;
  return <LogoutBttn onLogout={controller.handleLogout}></LogoutBttn>;
}
