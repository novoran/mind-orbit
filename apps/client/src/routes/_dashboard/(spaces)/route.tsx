import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_dashboard/(spaces)")({
  beforeLoad: ({ context }) => {
    // Check if there is an active workspace
    if (!context.activeOrganizationId) {
      throw redirect({
        to: "/",
      })
    }
  },
  component: () => <Outlet />,
})
