import Skeleton from "./skeleton";

export default function LoadingPlansHistory() {
  return (
    <div className="space-y-8">
      {/* Loading for Current Plans */}
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Current Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <div className="space-y-4">
          <Skeleton width="full" height={104} />
          <Skeleton width="full" height={104} />
        </div>
      </div>

      {/* Loading for Archived Plans */}
      <div>
        <div className="mt-6 mb-4">
          <h2 className="mb-2">Archived Plans</h2>
          <hr className="border-foreground/20 relative right-1/2 left-1/2 -mr-[50vw] -ml-[50vw] w-screen border-t" />
        </div>
        <div className="space-y-4">
          <Skeleton width="full" height={104} />
        </div>
      </div>
    </div>
  );
}
