import Link from "next/link";
import Image from "next/image";

type CardVariant = "plan" | "workout";

type WorkoutCardProps = {
  name: string;
  planSlug?: string;
  workoutSlug?: string;
  variant?: CardVariant;
};

export default function WorkoutCard({
  name,
  planSlug,
  workoutSlug,
  variant = "workout",
}: WorkoutCardProps) {
  return (
    <Link
      href={
        variant === "plan"
          ? `/workouts/${planSlug}`
          : `/workouts/${planSlug}/${workoutSlug}`
      }
    >
      <div className="bg-gray flex h-20 cursor-pointer items-center overflow-hidden rounded-lg drop-shadow-md">
        <div className="mx-auto w-11/12">
          <h2 className="text-xl font-bold">{name}</h2>
        </div>
        <Image
          src="/dumbell-banner-light.svg"
          alt="Workout Plan"
          fill
          className="w-full scale-125 rounded-md object-cover"
        />
      </div>
    </Link>
  );
}
