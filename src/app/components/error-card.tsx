"use client";

import Image from "next/image";
import Button from "./ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function ErrorCard({
  errorText,
  variant,
}: {
  errorText: string;
  variant: "primary" | "secondary";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <>
      <div
        className={`bg-faded-red flex flex-col justify-end overflow-hidden rounded-lg p-2 drop-shadow-md ${isPending ? "animate-pulse opacity-50" : ""} ${variant === "primary" ? "h-28" : "h-full w-full"}`}
      >
        {/* Text positioned in center of entire card */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-4">
          <p className="text-center text-lg font-medium text-white">
            {errorText}
          </p>

          <div className="mt-2 flex justify-center">
            <Button
              variant="secondary"
              text="Refresh"
              size="small"
              onClick={handleRefresh}
            />
          </div>
        </div>

        {/* Background Image */}
        {variant === "primary" && (
          <Image
            src="/dumbell-banner-light.svg"
            alt="Workout Plan"
            fill
            className="w-full scale-110 rounded-md object-cover opacity-50"
          />
        )}
      </div>
    </>
  );
}
