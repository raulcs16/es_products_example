"use client";
import { useAuthState } from "../context/AuthContext";
import UserCard from "../imports/UserCard";

export default function UserComponent() {
  const { user } = useAuthState();
  if (!user) return null;
  return (
    <UserCard
      imgSrc={user.image}
      dispalyName={user.name}
      onClick={function (x: number, y: number): void {}}
    ></UserCard>
  );
}
