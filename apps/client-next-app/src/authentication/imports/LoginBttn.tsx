"use client";

import Button from "@/src/imports/controls/Button";
import TextInput from "@/src/imports/controls/TextInput";

export interface LoginBttnProps {
  isLoading: boolean;
  onGoogleLogin: () => void;
}

export default function LoginBttn(props: LoginBttnProps) {
  return (
    <div className="w-fit space-y-3">
      <h1 className="text-primary font-bold text-center text-2xl">
        Login to your account
      </h1>
      <p className="text-secondary text-sm text-center">
        Enter your email below to login in to your account
      </p>
      <form className="text-primary text-sm pt-4 space-y-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            name="email"
            type="text"
            placeholder="mail@email.com"
            className="border border-white/20 rounded-lg bg-bg-light p-1"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <label htmlFor="password">Password</label>
            <small>Forgot your password?</small>
          </div>
          <input
            name="password"
            type="text"
            className="border border-white/20 rounded-lg bg-bg-light p-1"
          />
        </div>
        <button className="w-full rounded-sm bg-slate-100 text-black p-1 hover:opacity-75">
          Login
        </button>
      </form>
      <div className="flex gap-1 items-center text-secondary">
        <div className="grow border-t border-slate-700" />
        <p>Or continue with</p>
        <div className="grow border-t border-slate-700" />
      </div>
      <button
        className="w-full rounded-sm bg-bg-light text-black p-1 border-2 border-white/20  hover:opacity-75"
        onClick={props.onGoogleLogin}
        disabled={props.isLoading}
      >
        <span className="text-primary">
          {props.isLoading ? "Checking..." : "Google Login"}
        </span>
      </button>
    </div>
  );
}
