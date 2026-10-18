export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8" aria-label="Cargando panel" role="status">
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-surface-container-high" />
        <div className="h-9 w-48 rounded bg-surface-container-high" />
        <div className="h-4 w-60 rounded bg-surface-container-high" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 rounded-lg bg-surface-container-high" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => (
          <div key={index} className="h-80 rounded-lg bg-surface-container-high" />
        ))}
      </div>
    </div>
  );
}
