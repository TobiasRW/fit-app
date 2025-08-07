"use client";
import { useState, useActionState, useEffect } from "react";
import Button from "../ui/button";
import Input from "../ui/input";
import Form from "next/form";
import { AnimatePresence, motion } from "motion/react";
import { updateUserGoal } from "@/app/(main)/profile/actions";

type ModalProps = {
  goal?: number;
};

export default function EditGoalModal({ goal }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(updateUserGoal, {});
  const [goalValue, setGoalValue] = useState<number>(goal ?? 1);

  // Function to increment the goal
  const incrementGoal = () => {
    if (goalValue && goalValue < 7) {
      setGoalValue(goalValue + 1);
    }
  };

  // Function to decrement the goal
  const decrementGoal = () => {
    if (goalValue && goalValue > 1) {
      setGoalValue(goalValue - 1);
    }
  };

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state?.success]);

  return (
    <>
      <Button text="Edit Goal" onClick={() => setIsOpen(true)} />
      <AnimatePresence>
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
              <div className="mb-4 flex flex-col items-center justify-center text-center">
                <h2 className="mb-4 text-2xl font-semibold">Edit Your Goal</h2>
                <p>How many days a week do you want to exercise?</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <div
                  className={`${goalValue === 1 ? "bg-gray" : "bg-green"} flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white`}
                  onClick={() => decrementGoal()}
                >
                  -
                </div>
                <Input
                  name="goal"
                  type="number"
                  variant="borderless"
                  placeholder={goal?.toString() ?? "1"}
                  value={goalValue}
                  onChange={(e) => setGoalValue(Number(e.target.value))}
                  required
                  max={7}
                  min={1}
                />
                <div
                  className={`${goalValue === 7 ? "bg-gray" : "bg-green"} flex h-10 w-10 items-center justify-center rounded-full text-2xl text-white`}
                  onClick={() => incrementGoal()}
                >
                  +
                </div>
              </div>
              <div className="mt-8 flex items-center justify-center gap-10">
                <Button
                  text={`${pending ? "Updating..." : "Update"}`}
                  disabled={pending}
                />
                <Button
                  type="button"
                  variant="secondary"
                  text="Cancel"
                  onClick={() => setIsOpen(false)}
                />
              </div>
              {state?.error && (
                <div className="text-red-500">{state.error}</div>
              )}
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
