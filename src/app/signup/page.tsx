"use client";

import { signup } from "./actions";
import { BarbellIcon } from "@phosphor-icons/react/ssr";
import Form from "next/form";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
  error: undefined,
  success: undefined,
};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);
  return (
    <main className="w-11/12 mx-auto">
      <div className="flex mt-20 mb-10 justify-center items-center flex-col space-y-4">
        <BarbellIcon size={64} weight="fill" className="text-green" />
        <h1 className="text-2xl font-bold">Welcome to Fit App</h1>
        <p className="text-foreground">Please log in or sign up to continue</p>
      </div>

      {state?.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex flex-col">
          {state.success}
          <Link
            href="/login"
            className="p-1 bg-green text-white rounded-full mt-2 text-center w-2/6"
          >
            Go to Login
          </Link>
        </div>
      )}
      <Form action={formAction} className="flex flex-col space-y-4">
        <Input
          id="name"
          name="name"
          type="text"
          label="Name:"
          placeholder="Enter your name"
          required
        />
        <Input
          id="email"
          name="email"
          type="email"
          label="Email:"
          placeholder="Enter your email"
          required
        />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password:"
          placeholder="Enter your password"
          required
        />
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password:"
          placeholder="Confirm your password"
          required
        />
        <Button text="Sign up" disabled={pending} />
      </Form>

      <p className="mt-4 text-center">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
