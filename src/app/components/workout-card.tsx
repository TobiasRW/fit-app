import Link from "next/link";
import Image from "next/image";

type WorkoutCardProps = {
  id: string;
  name: string;
};

export default function WorkoutCard({ id, name }: WorkoutCardProps) {
  return (
    <Link href={`/workouts/${id}`}>
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
