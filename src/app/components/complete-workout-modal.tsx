"use client";
import { useActionState, useEffect, useState } from "react";
import { motion } from "motion/react";
import { saveCompletedWorkout } from "../(main)/session/[workoutSlug]/actions";
import Button from "./button";
import Form from "next/form";
import { CurrentWorkout } from "../types";

export default function CompleteWorkoutModal({
  workout,
}: {
  workout: CurrentWorkout;
}) {
  const [state, formAction, pending] = useActionState(saveCompletedWorkout, {});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  return (
    <>
      <Button
        text={workout.completed ? "Finished" : "Finish Workout"}
        variant={workout.completed ? "secondary" : "primary"}
        onClick={workout.completed === true ? undefined : () => setIsOpen(true)}
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
                Finish &apos;{workout.name}&apos;
              </h2>
              <p className="text-foreground/50">
                Are you sure you want to finish this workout? you will not be
                able to edit it after.
              </p>
            </div>
            <div className="flex items-center justify-center gap-10">
              <Button
                type="submit"
                variant="primary"
                text={pending ? "Finishing..." : "Finish"}
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
