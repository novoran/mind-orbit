import { Button } from "@mindorbit/ui/components/button"
import { AnimatedThemeToggler } from "@mindorbit/ui/components/animated-theme-toggler"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return (
    <div className="flex min-h-svh flex-col p-6">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-xl font-semibold">Mind Orbit</h1>
        <AnimatedThemeToggler className="border-border hover:bg-muted flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border transition-colors" />
      </div>
      <div className="mt-8 flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Project ready!</h1>
          <p>You may now add components and start building.</p>
          <p>
            We&apos;ve already added the button component and dark mode for you.
          </p>
          <Button className="mt-2">Button</Button>
        </div>
      </div>
    </div>
  )
}
