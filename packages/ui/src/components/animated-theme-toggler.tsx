import { useCallback, useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { Moon02Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@mindorbit/ui/lib/utils"
import { Button } from "./button"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<
  typeof Button
> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current
    if (!button) return

    const { top, left, width, height } = button.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight
    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    const applyTheme = () => {
      const newTheme = !isDark
      setIsDark(newTheme)
      document.documentElement.classList.toggle("dark")
      localStorage.setItem("vite-ui-theme", newTheme ? "dark" : "light")
    }

    if (typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme)
    })

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      )
    })
  }, [isDark, duration])

  return (
    <Button
      variant="ghost"
      size="icon"
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn("size-9", className)}
      {...props}
    >
      <HugeiconsIcon icon={isDark ? Sun01Icon : Moon02Icon} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
