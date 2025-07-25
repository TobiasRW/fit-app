import Form from "next/form";
import { createWorkoutPlan } from "../actions";

export default function Page() {
  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">Create workout plan</h1>
      <div className="mt-6">
        <Form action={createWorkoutPlan} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              Workout Plan Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter workout plan name"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-blue-500 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-600"
          >
            Create Workout Plan
          </button>
        </Form>
      </div>
    </main>
  );
}
