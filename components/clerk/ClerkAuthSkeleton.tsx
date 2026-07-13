export function ClerkAuthSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4 animate-pulse px-3">
      <div className="h-10 w-full rounded-md bg-white/10" />
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <div className="h-4 w-4 rounded-full bg-white/10" />
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-10 w-full rounded-md bg-white/10" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-white/10" />
        <div className="h-10 w-full rounded-md bg-white/10" />
      </div>
      <div className="h-10 w-full rounded-md bg-white/20" />
    </div>
  );
}
