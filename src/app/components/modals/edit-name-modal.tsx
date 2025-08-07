"use client";

import { useState, useActionState } from "react";
import Button from "../ui/button";
import Input from "../ui/input";
import Form from "next/form";
import { AnimatePresence, motion } from "motion/react";
import { PencilIcon } from "@phosphor-icons/react";
import { InitialState } from "../../types";

type modalProps = {
  planSlug?: string;
  workoutId?: string;
  planId?: string;
  action: (
    prevState: InitialState,
    formData: FormData,
  ) => Promise<InitialState>;
  title: string;
  currentName: string;
};

export default function EditNameModal({
  workoutId,
  planSlug,
  planId,
  action,
  title,
  currentName,
}: modalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <>
      <PencilIcon
        onClick={() => setIsOpen(true)}
        size={20}
        className="text-green"
      />

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
              <h2 className="mb-4 text-center text-2xl font-semibold">
                {title}
              </h2>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder={currentName}
                required
              />
              {planId && <input type="hidden" name="planId" value={planId} />}
              {workoutId && (
                <>
                  <input type="hidden" name="workoutId" value={workoutId} />
                  <input type="hidden" name="planSlug" value={planSlug} />
                </>
              )}
              <div className="mt-4 flex items-center justify-center gap-10">
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
