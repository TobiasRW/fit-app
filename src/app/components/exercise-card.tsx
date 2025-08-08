"use client";

import { useState, useActionState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import Form from "next/form";
import Button from "./ui/button";
import { deleteExerciseFromWorkout } from "../(main)/workouts/actions";
import EditExerciseModal from "./modals/edit-exercise-modal";
import { WorkoutExercise } from "@/app/types";

export default function ExerciseCard({
  exercise,
  planSlug,
  workoutSlug,
  workoutId,
}: {
  exercise: WorkoutExercise;
  planSlug: string;
  workoutSlug: string;
  workoutId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="bg-gray dark:bg-dark-gray my-4 rounded-lg drop-shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-col">
            <h3 className="text-xl font-semibold">
              {exercise.exercises?.name || "Exercise name not found"}
            </h3>
            <p className="italic"> {exercise.sets.length} sets</p>
          </div>
          <CaretDownIcon
            size={24}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="bg-background mt-1 overflow-hidden rounded-b-lg dark:bg-[#3d3d3d]"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex w-full">
                <table className="w-4/6">
                  <thead>
                    <tr className="border-foreground bg-green dark:bg-dark-green text-background border-r border-b">
                      <th className="border-foreground dark:text-foreground w-4/10 border-r px-4 py-2 text-left">
                        Sets
                      </th>
                      <th className="dark:text-foreground w-6/10 px-4 py-2 text-left">
                        Reps
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set) => (
                      <tr
                        key={set.id}
                        className="border-foreground border-b last:border-b-0"
                      >
                        <td className="border-foreground bg-faded-green dark:text-background border-r px-4 py-2">
                          Set {set.set_number}
                        </td>
                        <td className="bg-background w-full border-r px-4 py-2 dark:bg-[#3d3d3d]">
                          {set.target_reps} reps
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="flex w-2/6 flex-col items-center justify-center gap-4">
                  <Button
                    variant="destructive"
                    text="Delete"
                    size="small"
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setIsDeleting(true)}
                  />
                  <Button
                    text="Edit"
                    size="small"
                    type="button"
                    onClick={() => setIsEditing(true)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isDeleting && (
          <DeleteExerciseModal
            setIsDeleting={setIsDeleting}
            exercise={exercise}
            exerciseId={exercise.id}
            planSlug={planSlug}
            workoutSlug={workoutSlug}
            workoutId={workoutId}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditing && (
          <EditExerciseModal
            setIsEditing={setIsEditing}
            exercise={exercise}
            planSlug={planSlug}
            workoutSlug={workoutSlug}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function DeleteExerciseModal({
  exercise,
  exerciseId,
  planSlug,
  workoutSlug,
  workoutId,
  setIsDeleting,
}: {
  exercise: WorkoutExercise;
  exerciseId: string;
  planSlug: string;
  workoutSlug: string;
  workoutId: string;
  setIsDeleting: (isDeleting: boolean) => void;
}) {
  const [state, formAction, pending] = useActionState(
    deleteExerciseFromWorkout,
    {},
  );

  // Close modal on success
  useEffect(() => {
    if (state?.success) {
      setIsDeleting(false);
    }
  }, [state?.success, setIsDeleting]);

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
        <input type="hidden" name="workoutExerciseId" value={exerciseId} />
        <input type="hidden" name="planSlug" value={planSlug} />
        <input type="hidden" name="workoutSlug" value={workoutSlug} />
        <input type="hidden" name="workoutId" value={workoutId} />

        <div className="mb-4 flex flex-col items-center justify-between text-center">
          <h2 className="text-2xl font-semibold">
            Delete &apos;{exercise.exercises?.name}&apos;
          </h2>

          <p className="text-foreground/50">
            Are you sure you want to delete this exercise? This action cannot be
            undone.
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
            onClick={() => setIsDeleting(false)}
          />
        </div>
        {state?.error && <div className="text-red-500">{state.error}</div>}
      </Form>
    </motion.div>
  );
}
