export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-950 px-6 py-16 text-center text-slate-100">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">404</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-md text-base text-slate-300 sm:text-lg">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Try heading back to the dashboard to continue racing.
        </p>
      </div>
      <a
        href="/"
        className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
      >
        Return to home
      </a>
    </main>
  )
}
