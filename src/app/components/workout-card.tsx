"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./button";
import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { deleteWorkout, deleteWorkoutPlan } from "../(main)/workouts/actions";
import Form from "next/form";
import { InitialState } from "../types";

type CardVariant = "plan" | "workout";

type WorkoutCardProps = {
  name: string;
  planSlug?: string;
  planId?: string;
  workoutSlug?: string;
  workoutId?: string;
  variant?: CardVariant;
};

export default function WorkoutCard({
  name,
  planSlug,
  planId,
  workoutSlug,
  workoutId,
  variant = "workout",
}: WorkoutCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div>
        <div className="bg-gray flex h-26 cursor-pointer items-center overflow-hidden rounded-lg px-2 drop-shadow-md">
          <div className="mx-auto w-11/12">
            <h2 className="text-xl font-bold">{name}</h2>
          </div>
          <div className="z-10 flex flex-col gap-4">
            <Link
              href={
                variant === "plan"
                  ? `/workouts/${planSlug}`
                  : `/workouts/${planSlug}/${workoutSlug}`
              }
            >
              <Button variant="primary" text="Edit" size="small" />
            </Link>
            <Button
              variant="destructive"
              text="Delete"
              size="small"
              onClick={() => setIsOpen(true)}
            />
          </div>
          <Image
            src="/dumbell-banner-light.svg"
            alt="Workout Plan"
            fill
            className="w-full scale-110 rounded-md object-cover"
          />
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <DeleteModal
            planSlug={planSlug}
            planId={planId}
            workoutId={workoutId}
            setIsOpen={setIsOpen}
            variant={variant}
            action={variant === "plan" ? deleteWorkoutPlan : deleteWorkout}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function DeleteModal({
  planSlug,
  planId,
  workoutId,
  variant,
  action,
  setIsOpen,
}: {
  planSlug?: string;
  planId?: string;
  workoutId?: string;
  variant: CardVariant;
  action: (
    prevState: InitialState,
    formData: FormData,
  ) => Promise<InitialState>;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
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
        {variant === "workout" && (
          <>
            <input type="hidden" name="planId" value={planId} />
            <input type="hidden" name="planSlug" value={planSlug} />
            <input type="hidden" name="workoutId" value={workoutId} />
          </>
        )}
        {variant === "plan" && (
          <>
            <input type="hidden" name="planId" value={planId} />
          </>
        )}

        <div className="mb-4 flex flex-col items-center justify-between text-center">
          <h2 className="text-2xl font-semibold">
            {variant === "workout" ? "Delete Workout" : "Delete Workout Plan"}
          </h2>

          <p className="text-foreground/50">
            Are you sure you want to delete this{" "}
            {variant === "workout" ? "workout" : "workout plan"}? This action
            cannot be undone.
          </p>
        </div>

        <div className="flex items-center justify-center gap-10">
          <Button
            type="submit"
            variant="destructive"
            text={pending ? "Deleting..." : "Delete "}
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
  );
}
