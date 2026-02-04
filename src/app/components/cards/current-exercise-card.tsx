"use client";

import { ExerciseWithPerformance } from "../../types";
import { useState, useActionState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { saveCompletedExercise } from "../../(main)/session/[workoutSlug]/actions";
import Form from "next/form";
import Input from "../ui/input";
import Textarea from "../ui/textarea";
import Button from "../ui/button";

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

  // Get the completion status of the sets
  const getSetCompletionStatus = () => {
    const totalSets = exercise.sets.length;
    const savedSetsCount = exercise.currentSessionData?.sets?.length ?? 0;

    if (savedSetsCount === totalSets) {
      return "complete";
    } else if (savedSetsCount > 0) {
      return "partial";
    } else {
      return "none";
    }
  };

  const setStatus = getSetCompletionStatus();

  // Function to render the appropriate status badge
  const renderStatusBadge = () => {
    if (workoutCompleted) {
      return (
        <span className="bg-foreground/50 rounded-full px-2 py-1 text-[10px] text-white">
          Saved
        </span>
      );
    }

    switch (setStatus) {
      case "complete":
        return (
          <span className="rounded-full bg-green-500 px-2 py-1 text-[10px] text-white">
            Complete
          </span>
        );
      case "partial":
        return (
          <span className="rounded-full bg-yellow-500 px-2 py-1 text-[10px] text-white">
            In Progress
          </span>
        );
      case "none":
      default:
        return null;
    }
  };

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
      <div className="bg-gray dark:bg-dark-gray my-4 rounded-lg drop-shadow-md">
        <div
          className="flex h-full items-center justify-between gap-4 px-3 py-4"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex w-full items-center justify-between gap-4">
            <h3 className="font-semibold">{exercise.exercise.name}</h3>
            <div className="flex items-center gap-2">{renderStatusBadge()}</div>
          </div>
          <CaretDownIcon
            size={24}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="bg-background overflow-hidden rounded-b-lg dark:bg-[#3d3d3d]"
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
                      <tr className="border-foreground bg-green dark:bg-dark-green text-background border-b">
                        <th className="border-foreground dark:text-foreground w-2/6 border-r px-4 py-2 text-center">
                          Sets
                        </th>
                        <th className="border-foreground dark:text-foreground w-2/6 border-r px-4 py-2 text-center">
                          Reps
                        </th>
                        <th className="border-foreground dark:text-foreground w-2/6 px-4 py-2 text-center">
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
                            <p className="dark:text-background">
                              {set.set_number}
                            </p>
                            <p className="text-foreground/50 dark:text-background/75 text-xs">
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
                              step="0.01"
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
                              step="0.01"
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
