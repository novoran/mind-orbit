import { Link } from "@tanstack/react-router"

export function NotFound() {
  return (
    <div className="bg-background flex min-h-dvh flex-col items-center justify-center px-4 py-12 text-center">
      <div className="relative mb-8">
        <div className="bg-primary/10 absolute -inset-4 rounded-full blur-3xl" />
        <h1 className="text-foreground decoration-primary relative text-9xl font-black tracking-tighter underline-offset-8">
          404
        </h1>
      </div>
      <div className="max-w-[500px] space-y-4">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Lost in Orbit?
        </h2>
        <p className="text-muted-foreground text-lg">
          The page you're looking for seems to have drifted away into deep
          space. Let's get you back to mission control.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md px-8 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          Go to Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-11 items-center justify-center rounded-md border px-8 text-sm font-medium transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        >
          Go Back
        </button>
      </div>
    </div>
  )
}
