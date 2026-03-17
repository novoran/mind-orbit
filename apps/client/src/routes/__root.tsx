import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router"
import * as React from "react"

import appCss from "@mindorbit/ui/globals.css?url"

import {
  SIDEBAR_COOKIE_NAME,
  SidebarInset,
  SidebarProvider,
} from "@mindorbit/ui/components/sidebar"
import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"
import { TooltipProvider } from "@mindorbit/ui/components/tooltip"

import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"

export const Route = createRootRoute({
  // Runs on both server and client — read the sidebar cookie
  loader: ({ context }: { context: { request?: Request } }) => {
    let cookieHeader = ""
    if (context.request) {
      cookieHeader = context.request.headers.get("cookie") ?? ""
    } else if (typeof document !== "undefined") {
      cookieHeader = document.cookie
    }

    const match = cookieHeader.match(
      new RegExp(`(?:^|;)\\s*${SIDEBAR_COOKIE_NAME}=([^;]*)`)
    )
    // Default to open (true) if no cookie exists yet
    const sidebarOpen = match ? match[1] === "true" : true
    return { sidebarOpen }
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

              // Sidebar State
              var cookie = document.cookie.match(/(?:^|;)\\s*sidebar_state=([^;]*)/);
              var state = cookie ? cookie[1] : "true";
              root.setAttribute('data-sidebar-state', state === "true" ? "expanded" : "collapsed");
            } catch (e) {}
          })()
        `,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
        404
      </h1>
      <p className="text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline"
      >
        Go back to Dashboard
      </Link>
    </div>
  ),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Read the server-loaded sidebar state — available synchronously on both
  // server and client, so the first render is already correct with no flash.
  const { sidebarOpen } = Route.useLoaderData()

  return (
    <html lang="en" data-sidebar-state={sidebarOpen ? "expanded" : "collapsed"}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey="vite-ui-theme">
          <TooltipProvider>
            <SidebarProvider defaultOpen={sidebarOpen}>
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
