"use client";

import { signup } from "./actions";
import { BarbellIcon } from "@phosphor-icons/react/ssr";
import Form from "next/form";
import Input from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import Link from "next/link";
import { useActionState } from "react";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, {});
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

      {state?.success && (
        <div className="mb-4 flex flex-col rounded border border-green-400 bg-green-100 p-3 text-green-700">
          {state.success}
          <Link
            href="/login"
            className="bg-green mt-2 w-2/6 rounded-full p-1 text-center text-white"
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
        <Button
          text={`${pending ? "Signing up..." : "Sign up"}`}
          disabled={pending}
        />
      </Form>

      <p className="mt-4 text-center">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
