import Skeleton from "./skeleton";

export default function LoadingGoal() {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <Skeleton width={56} height={60} rounded={12} transparent={true} centered>
        <p className="text-gray dark:text-dark-gray text-6xl">4</p>
      </Skeleton>
      <Skeleton
        width={128}
        height={12}
        rounded={12}
        offsetBottom={5}
        offsetTop={5}
      />
      <Skeleton width={100} height={40} rounded="full" offsetTop={8} />
    </div>
  );
}
