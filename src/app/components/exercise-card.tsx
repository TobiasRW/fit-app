"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CaretDownIcon } from "@phosphor-icons/react";

type WorkoutExercise = {
  id: string;
  order_index: number;
  exercises: {
    id: string;
    name: string;
  };
  sets: {
    id: string;
    set_number: number;
    target_reps: number;
  }[];
};

export default function ExerciseCard({
  exercise,
}: {
  exercise: WorkoutExercise;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-gray my-4 rounded-lg drop-shadow-md">
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
              className="bg-background mt-1 overflow-hidden rounded-b-lg"
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {exercise.sets.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="border-foreground bg-green text-background border-b">
                      <th className="border-foreground w-2/10 border-r px-4 py-2 text-left">
                        Sets
                      </th>
                      <th className="w-8/10 px-4 py-2 text-left">Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exercise.sets.map((set) => (
                      <tr
                        key={set.id}
                        className="border-foreground border-b last:border-b-0"
                      >
                        <td className="border-foreground bg-faded-green border-r px-4 py-2">
                          Set {set.set_number}
                        </td>
                        <td className="bg-background w-full px-4 py-2">
                          {set.target_reps} reps
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 italic">
                  No sets configured for this exercise
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
