export default function Unauthorized() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Unauthorized</h1>
      <p className="mt-2 text-text-secondary">You don't have permission to view this page.</p>
    </div>
  )
}
