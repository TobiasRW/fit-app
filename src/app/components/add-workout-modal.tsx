"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { PlusIcon, XIcon } from "@phosphor-icons/react";
import Form from "next/form";
import Input from "./input";
import Button from "./button";
import { useActionState } from "react";
import { addWorkoutToPlan } from "../(main)/workouts/actions";

const initialState = {
  error: undefined,
  success: undefined,
};

export default function AddWorkoutModal({ planId }: { planId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    addWorkoutToPlan,
    initialState,
  );

  // Close the modal when the form is successfully submitted
  useEffect(() => {
    if (state?.success) {
      setIsOpen(false);
    }
  }, [state]);

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
              className="fixed right-0 bottom-0 left-0 h-5/6 space-y-4 rounded-t-2xl bg-white pt-4 shadow-lg"
            >
              <div className="mx-auto flex w-11/12 items-center justify-between">
                <h2 className="text-2xl font-semibold">New workout</h2>
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
                <Input
                  type="text"
                  id="workoutName"
                  name="workoutName"
                  label="Workout name"
                  required
                  placeholder="Enter workout name"
                />

                <input type="hidden" name="planId" value={planId} />
                <Button text="Create Workout" />
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
