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

import { ThemeProvider } from "@mindorbit/ui/components/theme-provider"
import { TooltipProvider } from "@mindorbit/ui/components/tooltip"
import appCss from "@mindorbit/ui/globals.css?url"
import "goey-toast/styles.css"
import { GooeyToaster } from "goey-toast"
import getCookie, { deleteCookie, setCookie } from "get-cookie"

import type { ConvexQueryClient } from "@convex-dev/react-query"
import type { QueryClient } from "@tanstack/react-query"

import { NotFound } from "@/components/not-found"
import { authClient } from "@/lib/auth-client"
import { getToken } from "@/lib/auth-server"

// Get auth information for SSR using available cookies
const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken()
})

// Synchronous client-side cache for the auth session to enable instant transitions
// const authCache = {
//   initialized: false,
//   isAuthenticated: false,
//   token: null as string | null,
// }

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
    // This removes the wait for a network promise during internal link clicks.
    const isAuthActive = getCookie("mind-orbit.auth-active") === "true"

    if (isAuthActive) {
      // Optimistically assume authenticated for instant navigation.
      // The RootComponent's useSession will handle the actual data fetching.
      return {
        isAuthenticated: true,
      }
    }

    // Fallback for initial load or if the cookie is missing/stale
    const session = await authClient.getSession()
    const token = session.data?.session.token ?? null
    const activeOrganizationId =
      session.data?.session.activeOrganizationId ?? null

    // Better Auth organization plugin usually doesn't return full member in getSession session object,
    // but the session data might have it or we might need to fetch it.
    // For now let's try getting it if it exists.
    const activeMember = (session.data as any)?.member ?? null

    return {
      isAuthenticated: !!token,
      token,
      activeOrganizationId,
      activeMember,
    }
  },
  loader: ({ context }) => {
    // Access token from context populated in beforeLoad
    const { token } = context

    // all queries, mutations and actions through TanStack Query will be
    // authenticated during SSR if we have a valid token
    if (token) {
      // During SSR only (the only time serverHttpClient exists),
      // set the auth token to make HTTP queries with.
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
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  const context = useRouteContext({ from: Route.id })
  const loaderData = Route.useLoaderData()
  const session = authClient.useSession()

  // Reactive sync to manage the synchronous 'mind-orbit.auth-active' cookie.
  // This allows future navigations to be 'instant' while staying in sync with the session.
  React.useEffect(() => {
    if (session.data) {
      setCookie("mind-orbit.auth-active", "true", 30) // 30 days
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
      <RootDocument>
        <Outlet />
      </RootDocument>
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
