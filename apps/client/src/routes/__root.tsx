import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouteContext,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import * as React from "react"

import { LiveblocksProvider } from "@liveblocks/react"
import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"
import { TooltipProvider } from "@mindorbit/ui/components/tooltip"
import appCss from "@mindorbit/ui/globals.css?url"
import getCookie, { deleteCookie, setCookie } from "get-cookie"
import { GooeyToaster } from "goey-toast"
import "goey-toast/styles.css"

import type { ConvexQueryClient } from "@convex-dev/react-query"
import type { QueryClient } from "@tanstack/react-query"

import { NotFound } from "@/components/not-found"
import { authClient } from "@/lib/auth-client"
import { getToken } from "@/lib/auth-server"

// Get auth information for SSR using available cookies
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken()
})

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
  convexQueryClient: ConvexQueryClient
  isAuthenticated?: boolean
  token?: string | null
  user?: {
    name: string
    email: string
    image?: string | null
  } | null
  activeOrganizationId?: string | null
  activeMember?: any // Using any for now to avoid complex type import but could be defined
}>()({
  beforeLoad: async () => {
    // If we're on the server, perform the server-side check
    if (typeof window === "undefined") {
      const token = await getAuth()
      return {
        isAuthenticated: !!token,
        token,
      }
    }

    // On the client, we use a synchronous cookie check for "instant" transitions.
    const isAuthActive = getCookie("mind-orbit.auth-active") === "true"

    if (isAuthActive) {
      return {
        isAuthenticated: true,
      }
    }

    // Fallback for initial load
    const session = await authClient.getSession()
    const token = session.data?.session.token ?? null
    const activeOrganizationId =
      session.data?.session.activeOrganizationId ?? null
    const activeMember = (session.data as any)?.member ?? null

    return {
      isAuthenticated: !!token,
      token,
      activeOrganizationId,
      activeMember,
    }
  },
  loader: ({ context }) => {
    const { token } = context
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token)
    }

    return {
      sidebarOpen: true,
      isAuthenticated: !!token,
      token,
    }
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
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  const loaderData = Route.useLoaderData()
  const session = authClient.useSession()

  React.useEffect(() => {
    if (session.data) {
      setCookie("mind-orbit.auth-active", "true", 30)
    } else if (session.isPending === false) {
      deleteCookie("mind-orbit.auth-active")
    }
  }, [session.data, session.isPending])

  return (
    <ConvexBetterAuthProvider
      client={context.convexQueryClient.convexClient}
      authClient={authClient}
      initialToken={loaderData.token}
    >
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RootDocument>
          <Outlet />
        </RootDocument>
      </LiveblocksProvider>
    </ConvexBetterAuthProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider storageKey="vite-ui-theme">
          <TooltipProvider>
            <GooeyToaster />
            {children}
          </TooltipProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
