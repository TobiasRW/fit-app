"use client";
import { useActionState, useState } from "react";
import { motion } from "motion/react";
import Button from "../ui/button";
import Form from "next/form";
import { CurrentWorkout } from "../../types";
import { skipWorkout } from "@/app/(main)/session/[workoutSlug]/actions";

export default function SkipWorkoutModal({
  workout,
}: {
  workout: CurrentWorkout;
}) {
  const [state, formAction, pending] = useActionState(skipWorkout, {});
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        text="Skip Workout"
        variant="destructive"
        onClick={() => setIsOpen(true)}
        size="small"
      />
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form
            action={formAction}
            className="bg-background flex w-4/5 flex-col gap-2 rounded-lg p-6 shadow-lg"
          >
            <input type="hidden" name="workoutId" value={workout.id} />
            <input type="hidden" name="workoutSlug" value={workout.slug} />

            <div className="mb-4 flex flex-col items-center justify-between text-center">
              <h2 className="mb-4 text-2xl font-semibold">
                Skip &apos;{workout.name}&apos;
              </h2>
              <p className="text-foreground/50">
                Are you sure you want to skip this workout? you will not be able
                to edit it after.
              </p>
            </div>
            <div className="flex items-center justify-center gap-10">
              <Button
                type="submit"
                variant="destructive"
                text={pending ? "Skipping..." : "Skip"}
                disabled={pending}
              />
              <Button
                type="button"
                variant="secondary"
                text="Cancel"
                onClick={() => setIsOpen(false)}
              />
            </div>
            {state?.error && <div className="text-red-500">{state.error}</div>}
          </Form>
        </motion.div>
      )}
    </>
  );
}
