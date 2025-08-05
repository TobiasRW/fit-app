"use client";

import Link from "next/link";
import Image from "next/image";
import Button from "./button";
import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  deleteWorkout,
  deleteWorkoutPlan,
  setActivePlan,
  deactivatePlan,
} from "../(main)/workouts/actions";
import Form from "next/form";
import { InitialState } from "../types";

type CardVariant = "plan" | "workout" | "upcoming";

type WorkoutCardProps = {
  name: string;
  secondName?: string;
  planSlug?: string;
  planId?: string;
  workoutSlug?: string;
  workoutId?: string;
  variant?: CardVariant;
  isActive?: boolean;
  progress?: string;
};

export default function WorkoutCard({
  name,
  secondName,
  planSlug,
  planId,
  workoutSlug,
  workoutId,
  variant = "workout",
  isActive,
  progress,
}: WorkoutCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  // Separate hooks for each action
  const [activateState, activateAction, activatePending] = useActionState(
    setActivePlan,
    {},
  );
  const [deactivateState, deactivateAction, deactivatePending] = useActionState(
    deactivatePlan,
    {},
  );

  // Choose which state/action to use based on current status
  const currentState = isActive ? deactivateState : activateState;
  const currentAction = isActive ? deactivateAction : activateAction;
  const currentPending = isActive ? deactivatePending : activatePending;

  return (
    <>
      <div className="bg-gray flex h-28 flex-col justify-end overflow-hidden rounded-lg p-2 drop-shadow-md">
        {/* Make entire card clickable */}
        <Link
          href={
            variant === "plan"
              ? `/workouts/${planSlug}`
              : variant === "workout"
                ? `/workouts/${planSlug}/${workoutSlug}`
                : `/session/${workoutSlug}`
          }
          className="absolute inset-0 z-30"
        ></Link>

        {/* Text positioned in center of entire card */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4">
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        {secondName && variant === "upcoming" && (
          <div className="pl-2">
            <p className="text-foreground/50 text-sm">
              {secondName} | workout {progress}
            </p>
          </div>
        )}

        {/* Background Image */}
        <Image
          src="/dumbell-banner-light.svg"
          alt="Workout Plan"
          fill
          className="w-full scale-110 rounded-md object-cover"
        />
        {variant === "plan" && (
          <div className="relative z-30 flex items-center justify-between">
            <Form action={currentAction} className="">
              <input type="hidden" name="planId" value={planId} />
              <Button
                type="submit"
                variant={isActive === true ? "primary" : "secondary"}
                text={isActive === true ? "Active" : "Inactive"}
                size="extrasmall"
                disabled={currentPending}
              />
            </Form>
            <Button
              variant="destructive"
              text="Delete"
              size="extrasmall"
              onClick={() => setIsOpen(true)}
            />
          </div>
        )}
        {variant === "workout" && (
          <div className="relative z-30 flex justify-end">
            <Button
              variant="destructive"
              text="Delete"
              size="extrasmall"
              onClick={() => setIsOpen(true)}
            />
          </div>
        )}
      </div>
      {currentState?.error && (
        <div className="mt-2 text-center text-red-500">
          {currentState.error}
        </div>
      )}
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
