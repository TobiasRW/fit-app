import Skeleton from "./skeleton";

export default function LoadingSession() {
  return (
    <>
      <Skeleton height={40} width={200} rounded={8} />
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold">Exercises</h2>
          <div className="flex items-center justify-center gap-2">
            <Skeleton height={28} width={99} rounded="full" />
            <Skeleton height={28} width={109} rounded="full" />
          </div>
        </div>
        <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
      </section>

      <section className="mt-4 flex flex-col gap-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} height={56} />
        ))}
      </section>
    </>
  );
}
