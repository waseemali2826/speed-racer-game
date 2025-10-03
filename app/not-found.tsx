import Link from "next/link"

export default function NotFound() {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-16 text-center text-slate-100">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
        <p className="mt-4 max-w-md text-base text-slate-300 sm:text-lg">
          The page you are looking for couldn&apos;t be located. It may have been moved or removed.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
          >
            Return home
          </Link>
        </div>
      </body>
    </html>
  )
}
