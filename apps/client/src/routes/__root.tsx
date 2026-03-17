import * as React from "react"
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"

import appCss from "@mindorbit/ui/globals.css?url"

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "MindOrbit",
      },
      {
        name: "description",
        content:
          "MindOrbit is a multi-tenant, AI-powered productivity and project management platform.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
    scripts: [
      {
        children: `
          (function() {
            try {
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
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey="vite-ui-theme">{children}</ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
