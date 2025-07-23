import { signup } from "./actions";
import { BarbellIcon } from "@phosphor-icons/react/ssr";
import Form from "next/form";
import Input from "../components/input";
import Button from "../components/button";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="w-11/12 mx-auto">
      <div className="flex mt-20 mb-10 justify-center items-center flex-col space-y-4">
        <BarbellIcon size={64} weight="fill" className="text-green" />
        <h1 className="text-2xl font-bold">Welcome to Fit App</h1>
        <p className="text-foreground">Please log in or sign up to continue</p>
      </div>
      <Form action={signup} className="flex flex-col space-y-4">
        <Input id="email" name="email" type="email" label="Email:" required />
        <Input
          id="password"
          name="password"
          type="password"
          label="Password:"
          required
        />

        <Button text="Sign up" />
      </Form>

      <p className="mt-4 text-center">
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}
