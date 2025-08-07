"use client";

import { ExerciseWithPerformance } from "../types";
import { useState, useActionState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { saveCompletedExercise } from "../(main)/session/[workoutSlug]/actions";
import Form from "next/form";
import Input from "./input";
import Textarea from "./textarea";
import Button from "./button";

export default function CurrentExerciseCard({
  exercise,
  workoutCompleted,
}: {
  exercise: ExerciseWithPerformance;
  workoutCompleted: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [state, formAction, pending] = useActionState(
    saveCompletedExercise,
    {},
  );
  const saved = exercise.currentSessionData?.saved_at;
  const isCompleted = saved || state.success;

  useEffect(() => {
    if (state.success && !pending) {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, pending]);

  return (
    <>
      <div className="bg-gray my-4 rounded-lg drop-shadow-md">
        <div className="flex h-full items-center justify-between p-4">
          <div className="flex items-center justify-center gap-4">
            <h3 className="text-lg font-semibold">{exercise.exercise.name}</h3>
            {isCompleted && (
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-green-500 px-2 py-1 text-xs text-white">
                  ✓ Saved
                </span>
              </div>
            )}
            {workoutCompleted && (
              <div className="flex items-center gap-2">
                <span className="bg-foreground/50 rounded-full px-2 py-1 text-xs text-white">
                  ✓ Saved
                </span>
              </div>
            )}
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
              className="bg-background overflow-hidden rounded-b-lg"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Form action={formAction}>
                <input
                  type="hidden"
                  name="exerciseId"
                  id="exerciseId"
                  value={exercise.exercise.id}
                />
                <input
                  type="hidden"
                  name="workoutId"
                  id="workoutId"
                  value={exercise.workoutExerciseId}
                />
                <input
                  type="hidden"
                  name="workoutSlug"
                  id="workoutSlug"
                  value={exercise.exercise.slug}
                />
                <div className="flex w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="border-foreground bg-green text-background border-b">
                        <th className="border-foreground w-2/6 border-r px-4 py-2 text-center">
                          Sets
                        </th>
                        <th className="border-foreground w-2/6 border-r px-4 py-2 text-center">
                          Reps
                        </th>
                        <th className="border-foreground w-2/6 px-4 py-2 text-center">
                          Weight
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set) => (
                        <tr
                          key={set.id}
                          className="border-foreground border-b last:border-b-0"
                        >
                          <td className="border-foreground bg-faded-green flex items-center gap-4 border-r px-4 py-2">
                            <p className="">{set.set_number}</p>
                            <p className="text-foreground/50 text-xs">
                              (Reps: {set.target_reps})
                            </p>
                            <input
                              type="hidden"
                              name="setNumber"
                              value={set.set_number}
                            />
                          </td>
                          <td className="border-r px-2 py-2 text-center">
                            <Input
                              type="number"
                              name="reps"
                              defaultValue={
                                exercise.currentSessionData?.sets?.find(
                                  (s) => s.set_number === set.set_number,
                                )?.reps || ""
                              }
                              variant="table"
                              placeholder={set.lastReps?.toString() || ""}
                              max={20}
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <Input
                              variant="table"
                              type="number"
                              name="weight"
                              defaultValue={
                                exercise.currentSessionData?.sets?.find(
                                  (s) => s.set_number === set.set_number,
                                )?.weight || ""
                              }
                              placeholder={set.lastWeight?.toString() || ""}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Exercise Notes Section */}
                <div className="border-t px-2 pt-4 pb-2">
                  <Textarea
                    label="Notes"
                    name="notes"
                    placeholder={
                      exercise.lastPerformanceNotes ||
                      "Add notes about this exercise..."
                    }
                    defaultValue={exercise.currentSessionData?.notes || ""}
                    maxLength={200}
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-4 px-2 pb-4">
                  <Button
                    type="submit"
                    text={`${pending ? "Saving..." : "Save"}`}
                    disabled={pending || workoutCompleted}
                  />

                  {state.error && (
                    <p className="text-sm text-red-500">{state.error}</p>
                  )}
                  {isSuccess && (
                    <p className="text-sm text-green-500">Exercise saved!</p>
                  )}
                </div>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
