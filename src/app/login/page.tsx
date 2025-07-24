"use client";

import { login } from "./actions";
import { BarbellIcon } from "@phosphor-icons/react/ssr";
import Form from "next/form";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";
import { useActionState } from "react";

const initialState = {
  error: undefined,
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);
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

      <Form action={formAction} className="flex flex-col space-y-4">
        <Input id="email" name="email" type="email" label="Email:" required />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password:"
          required
        />

        <Button text="Log in" disabled={pending} />
      </Form>
      <p className="mt-4 text-center">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
