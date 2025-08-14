"use client";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { CompletedWorkout } from "../types";

type Props = {
  exercise: CompletedWorkout;
  showFullDate?: boolean; // More specific prop
};
export default function CompletedExerciseCard({
  exercise,
  showFullDate = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  // function to format date to a readable format
  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return showFullDate ? `${day}/${month}/${year}` : `${day}/${month}`;
  };

  return (
    <>
      <div className="bg-gray dark:bg-dark-gray gap-2 rounded-lg shadow-md">
        <div className="flex w-full items-center justify-between px-2 py-3">
          <div className="flex items-center gap-2">
            <p className="font-medium">{formatDate(exercise.completed_date)}</p>
            <span> - </span>
            <p>{exercise.workouts.name}</p>
          </div>
          <CaretDownIcon
            size={20}
            className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="overflow-hidden rounded-b-lg"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {exercise.completed_exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-background dark:bg-off-black border-foreground flex flex-col border-b p-2 last:border-0"
                >
                  <p className="mb-2 text-lg">{ex.exercises.name}</p>

                  <div className="flex w-full flex-col gap-2">
                    {ex.completed_sets.map((set) => (
                      <div
                        key={set.id}
                        className="flex w-full items-center gap-2"
                      >
                        <p>Set {set.set_number}:</p>
                        <p className="bg-muted rounded-md py-1 text-sm">
                          {set.reps} reps | {set.weight}kg
                        </p>
                      </div>
                    ))}
                  </div>
                  {ex.notes && (
                    <p className="text-foreground/50 text-sm italic">
                      Notes: {ex.notes}
                    </p>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
