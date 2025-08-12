"use client";
import { motion, AnimatePresence } from "motion/react";
import {
  addExerciseToWorkout,
  getAllExercises,
} from "../../(main)/workouts/actions";
import { useActionState, useEffect, useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import Form from "next/form";
import Input from "../ui/input";
import SearchDropdown from "../ui/search-dropdown";
import Button from "../ui/button";

export default function AddExerciseModal({
  workoutId,
  planSlug,
  workoutSlug,
}: {
  workoutId: string;
  planSlug: string;
  workoutSlug: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(addExerciseToWorkout, {});

  const [exercises, setExercises] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [numberOfSets, setNumberOfSets] = useState(3);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      const exerciseData = await getAllExercises();
      setExercises(exerciseData);
    };
    fetchExercises();
  }, []);

  // Close modal on success
  useEffect(() => {
    if (state?.success && !pending) {
      setIsOpen(false);
      setSelectedExercise("");
      setNumberOfSets(3);
    }
  }, [state?.success, pending]);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-green fixed right-4 bottom-24 flex items-center justify-center rounded-full p-4 drop-shadow-md"
        >
          <PlusIcon size={32} className="text-white" />
        </button>
      )}
      <AnimatePresence>
        {isOpen && (
          <div className="">
            <motion.div
              onClick={() => setIsOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-end justify-center bg-black/50"
            ></motion.div>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="dark:bg-off-black fixed right-0 bottom-0 left-0 z-50 h-5/6 space-y-4 overflow-y-auto rounded-t-2xl bg-white pt-4 shadow-lg"
            >
              <div className="mx-auto flex w-11/12 items-center justify-between">
                <h2 className="text-2xl font-semibold">Add Exercise</h2>
                <XIcon
                  size={26}
                  className="text-foreground"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <Form
                action={formAction}
                className="mx-auto flex w-11/12 flex-col gap-4"
              >
                <input type="hidden" name="planSlug" value={planSlug} />
                <input type="hidden" name="workoutSlug" value={workoutSlug} />
                <input type="hidden" name="workoutId" value={workoutId} />

                <div className="flex flex-col gap-10">
                  {/* Exercise Selection */}
                  <div className="min-w-0 flex-[2]">
                    <SearchDropdown
                      label="Exercise"
                      placeholder="Type to search..."
                      options={exercises.map((ex) => ex.name)}
                      onSelect={setSelectedExercise}
                    />
                    <input
                      type="hidden"
                      name="exerciseId"
                      value={
                        exercises.find((ex) => ex.name === selectedExercise)
                          ?.id || ""
                      }
                    />
                  </div>
                  {/* Sets Configuration */}
                  <div className="mx-auto">
                    <label className="mb-4 block text-center text-lg font-medium">
                      Sets
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfSets(Math.max(1, numberOfSets - 1))
                        }
                        className="bg-green flex h-8 w-8 items-center justify-center rounded-full text-white"
                        disabled={numberOfSets <= 1}
                      >
                        <span className="text-lg font-semibold">-</span>
                      </button>
                      <Input
                        type="number"
                        name="sets"
                        variant="borderless"
                        placeholder="Sets"
                        value={numberOfSets}
                        onChange={(e) =>
                          setNumberOfSets(
                            Math.max(
                              1,
                              Math.min(6, parseInt(e.target.value) || 1),
                            ),
                          )
                        }
                        required
                        disabled={true}
                        min={1}
                        max={6}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setNumberOfSets(Math.min(6, numberOfSets + 1))
                        }
                        className="bg-green flex h-8 w-8 items-center justify-center rounded-full text-white"
                        disabled={numberOfSets >= 6}
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
                      {Array.from({ length: numberOfSets }, (_, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="w-12 text-sm">Set {index + 1}:</span>
                          <Input
                            type="number"
                            name="setReps"
                            placeholder="Reps"
                            min={0}
                            max={20}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  text={`${pending ? "Adding..." : "Add Exercise"}`}
                  disabled={pending}
                />
              </Form>
              {state?.error && (
                <div className="mx-auto w-11/12 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                  {state.error}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
