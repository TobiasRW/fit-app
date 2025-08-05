export default async function Page({
  params,
}: {
  params: Promise<{ workoutSlug: string }>;
}) {
  const { workoutSlug } = await params;

  return (
    <main className="mx-auto mt-10 w-11/12">
      <h1 className="text-4xl font-bold">yoyoyo</h1>
    </main>
  );
}
