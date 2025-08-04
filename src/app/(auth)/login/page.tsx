"use client";

import { login } from "./actions";
import { BarbellIcon } from "@phosphor-icons/react/ssr";
import Form from "next/form";
import Input from "@/app/components/input";
import Button from "@/app/components/button";
import Link from "next/link";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, {});
  return (
    <main className="mx-auto w-11/12">
      <div className="mt-20 mb-10 flex flex-col items-center justify-center space-y-4">
        <BarbellIcon size={64} weight="fill" className="text-green" />
        <h1 className="text-2xl font-bold">Welcome to Fit App</h1>
        <p className="text-foreground">Please log in or sign up to continue</p>
      </div>

      {state?.error && (
        <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
          {state.error}
        </div>
      )}

      <Form action={formAction} className="flex flex-col space-y-4">
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

        <Button
          text={`${pending ? "Logging in..." : "Log in"}`}
          disabled={pending}
        />
      </Form>
      <p className="mt-4 text-center">
        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
      </p>
    </main>
  );
}
