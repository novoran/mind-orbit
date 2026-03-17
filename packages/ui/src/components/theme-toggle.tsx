"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons"

import { Button } from "./button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <HugeiconsIcon
        icon={isDark ? Sun01Icon : Moon01Icon}
        className="h-[1.2rem] w-[1.2rem] transition-all"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
