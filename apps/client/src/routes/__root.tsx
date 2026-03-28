import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import * as React from "react"

import appCss from "@mindorbit/ui/globals.css?url"

import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"
import { TooltipProvider } from "@mindorbit/ui/components/tooltip"

import { NotFound } from "@/components/not-found"

export const Route = createRootRoute({
  // Loader no longer needs to read sidebar cookie
  loader: () => {
    return { sidebarOpen: true }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MindOrbit" },
      {
        name: "description",
        content:
          "MindOrbit is a multi-tenant, AI-powered productivity and project management platform.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        // Inline script: apply theme and sidebar state before first paint to avoid flash
        children: `
          (function() {
            try {
              // Theme
              var theme = localStorage.getItem('vite-ui-theme') || 'system';
              var root = document.documentElement;
              root.classList.remove('light', 'dark');
              if (theme === 'system') {
                var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.add(systemTheme);
              } else {
                root.classList.add(theme);
              }
            } catch (e) {}
          })()
        `,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey="vite-ui-theme">
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
