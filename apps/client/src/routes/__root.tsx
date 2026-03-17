import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router"
import * as React from "react"

import appCss from "@mindorbit/ui/globals.css?url"

import { SidebarInset, SidebarProvider } from "@mindorbit/ui/components/sidebar"
import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"
import { TooltipProvider } from "@mindorbit/ui/components/tooltip"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

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
        <ThemeProvider storageKey="vite-ui-theme">
          <TooltipProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <Header />
                <div className="p-4">{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
