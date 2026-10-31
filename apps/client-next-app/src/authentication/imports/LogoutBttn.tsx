"use client";

export interface LogoutBttnProps {
  onLogout: () => void;
}
export default function LogoutBttn(props: LogoutBttnProps) {
  return (
    <button
      onClick={props.onLogout}
      className="p-2 border border-bg-light hover:border-blue rounded-lg bg-red-600"
    >
      <h1 className="text-primary font-bold">Log Out</h1>
    </button>
  );
}
