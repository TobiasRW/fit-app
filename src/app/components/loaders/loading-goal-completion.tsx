import Skeleton from "./skeleton";

export default function LoadingGoalCompletion() {
  return (
    <>
      <Skeleton offsetTop={16} offsetBottom={8} transparent>
        <p className="text-gray dark:text-dark-gray font-light italic">
          25 / 156 workouts completed
        </p>
      </Skeleton>
      <Skeleton height={12} rounded={4} />
    </>
  );
}
