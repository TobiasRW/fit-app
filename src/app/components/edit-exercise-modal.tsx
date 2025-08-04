"use client";
import { motion } from "motion/react";
import { updateExercise } from "../(main)/workouts/actions";
import { useActionState, useEffect, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import Form from "next/form";
import Input from "./input";
import Button from "./button";
import { WorkoutExercise } from "../types";

export default function EditExerciseModal({
  exercise,
  planSlug,
  workoutSlug,
  setIsEditing,
}: {
  exercise: WorkoutExercise;
  planSlug: string;
  workoutSlug: string;
  setIsEditing: (isEditing: boolean) => void;
}) {
  const [state, formAction, pending] = useActionState(updateExercise, {});

  // Initialize with existing sets data
  const [setReps, setSetReps] = useState<number[]>(
    exercise.sets
      .sort((a, b) => a.set_number - b.set_number)
      .map((set) => set.target_reps),
  );

  // Close modal on success
  useEffect(() => {
    if (state?.success) {
      setIsEditing(false);
    }
  }, [state?.success, setIsEditing]);

  const updateSetRep = (index: number, value: number) => {
    const newSetReps = [...setReps];
    newSetReps[index] = value;
    setSetReps(newSetReps);
  };

  const addSet = () => {
    if (setReps.length < 6) {
      setSetReps([...setReps, 8]); // Default to 8 reps
    }
  };

  const removeSet = () => {
    if (setReps.length > 1) {
      setSetReps(setReps.slice(0, -1));
    }
  };

  return (
    <>
      <motion.div
        onClick={() => setIsEditing(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/50"
      ></motion.div>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed right-0 bottom-0 left-0 z-50 h-5/6 space-y-4 overflow-y-auto rounded-t-2xl bg-white pt-4 shadow-lg"
      >
        <div className="mx-auto flex w-11/12 items-center justify-between">
          <h2 className="text-2xl font-semibold">Edit Exercise</h2>
          <XIcon
            size={26}
            className="text-foreground cursor-pointer"
            onClick={() => setIsEditing(false)}
          />
        </div>

        {/* Exercise Name Display */}
        <div className="mx-auto w-11/12">
          <div className="rounded-lg bg-gray-100 p-4">
            <h3 className="text-center text-lg font-medium">
              {exercise.exercises.name}
            </h3>
          </div>
        </div>

        <Form
          action={formAction}
          className="mx-auto flex w-11/12 flex-col gap-4"
        >
          <input type="hidden" name="planSlug" value={planSlug} />
          <input type="hidden" name="workoutSlug" value={workoutSlug} />
          <input type="hidden" name="workoutExerciseId" value={exercise.id} />

          <div className="flex flex-col gap-6">
            {/* Sets Configuration */}
            <div className="mx-auto">
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={removeSet}
                  className="bg-green flex h-8 w-8 items-center justify-center rounded-full text-white disabled:bg-gray-300"
                  disabled={setReps.length <= 1}
                >
                  <span className="text-lg font-semibold">-</span>
                </button>

                <span className="min-w-[60px] text-center text-lg font-medium">
                  {setReps.length} set{setReps.length !== 1 ? "s" : ""}
                </span>

                <button
                  type="button"
                  onClick={addSet}
                  className="bg-green flex h-8 w-8 items-center justify-center rounded-full text-white disabled:bg-gray-300"
                  disabled={setReps.length >= 6}
                >
                  <span className="text-lg font-semibold">+</span>
                </button>
              </div>
            </div>

            {/* Target Reps per Set */}
            <div className="space-y-2">
              <label className="text-foreground block text-lg font-medium">
                Target Reps per Set
              </label>
              <div className="mb-10 grid grid-cols-3 items-center justify-center gap-4">
                {setReps.map((reps, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="w-12 text-sm">Set {index + 1}:</span>
                    <Input
                      type="number"
                      name="setReps"
                      placeholder="Reps"
                      value={reps}
                      onChange={(e) =>
                        updateSetRep(index, parseInt(e.target.value) || 0)
                      }
                      min={1}
                      max={20}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            text={pending ? "Updating..." : "Update Exercise"}
            disabled={pending}
          />
        </Form>

        {state?.error && (
          <div className="mx-auto w-11/12 rounded border border-red-400 bg-red-100 p-3 text-red-700">
            {state.error}
          </div>
        )}
      </motion.div>
    </>
  );
}
