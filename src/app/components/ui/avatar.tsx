export default function Avatar({
  displayName,
  email,
}: {
  displayName?: string;
  email?: string;
}) {
  return (
    <>
      <div className="bg-green flex h-32 w-32 items-center justify-center rounded-full">
        <h3 className="text-5xl font-medium text-white">
          {displayName?.charAt(0).toUpperCase()}
        </h3>
      </div>
      <p className="mt-4 text-xl">{displayName}</p>
      <p className="font-light italic">{email}</p>
    </>
  );
}
