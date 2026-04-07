"use client"

import { PlusSignIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Badge } from "@mindorbit/ui/components/badge"
import { Button } from "@mindorbit/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@mindorbit/ui/components/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@mindorbit/ui/components/dropdown-menu"
import {
  Input,
  InputGroup,
  InputGroupAddon,
} from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@mindorbit/ui/components/sidebar"
import { cn } from "@mindorbit/ui/lib/utils"
import { useForm } from "@tanstack/react-form"
import { gooeyToast } from "goey-toast"
import * as React from "react"
import { useMutation } from "convex/react"
import { api } from "@mindorbit/backend/_generated/api"
import { authClient } from "@/lib/auth-client"

const getPlanBadgeColor = (plan: string) => {
  switch (plan.toLowerCase()) {
    case "team":
      return "border-indigo-500/20 bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20"
    case "pro":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20"
    default:
      return "border-slate-500/20 bg-slate-500/10 text-slate-500 dark:bg-slate-500/20"
  }
}

export function OrbitSwitcher({
  orbits,
  activeOrbit,
}: {
  orbits: Array<{
    name: string
    logo: string | null
    plan: string
    id: string
    slug: string
  }>
  activeOrbit?: {
    name: string
    logo: string | null
    plan: string
    id: string
    slug: string
  }
}) {
  const { isMobile } = useSidebar()
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)

  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

  const handleSetActive = async (orbitId: string) => {
    try {
      await authClient.organization.setActive({ organizationId: orbitId })
      gooeyToast.success("Orbit switched")
    } catch {
      gooeyToast.error("Failed to switch orbit")
    }
  }

  const form = useForm({
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const res = await authClient.organization.create({
          name: value.name,
          slug: value.slug || value.name.toLowerCase().replace(/ /g, "-"),
          logo: value.logo || undefined,
        })

        if (res.error) {
          gooeyToast.error(res.error.message || "Failed to create orbit")
          return
        }

        await authClient.organization.setActive({
          organizationId: res.data.id,
        })

        gooeyToast.success("Orbit created")
        setIsCreateOpen(false)
        setLogoPreview(null)
        form.reset()
      } catch {
        gooeyToast.error("An unexpected error occurred")
      }
    },
  })

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 500 * 1024) {
      gooeyToast.error("Logo must be under 500kb")
      return
    }

    try {
      setIsUploading(true)
      const uploadUrl = await generateUploadUrl()
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      })

      if (!result.ok) throw new Error("Upload failed")

      const { storageId } = await result.json()
      // Note: auth.organization.create expects an actual URL string.
      const logoUrl = `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/storage/${storageId}`

      form.setFieldValue("logo", logoUrl)
      setLogoPreview(URL.createObjectURL(file))
      gooeyToast.success("Logo uploaded")
    } catch {
      gooeyToast.error("Failed to upload logo")
    } finally {
      setIsUploading(false)
    }
  }

  const orbitData =
    activeOrbit ||
    orbits[0] ||
    ({
      name: "No Orbit",
      logo: null,
      plan: "Free",
      id: "none",
      slug: "none",
    } as const)

  return (
    <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="cursor-pointer hover:bg-transparent active:bg-transparent aria-expanded:bg-transparent"
                >
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    {orbitData.logo ? (
                      <img
                        src={orbitData.logo}
                        alt={orbitData.name}
                        className="size-full rounded-lg object-cover"
                      />
                    ) : (
                      <div className="bg-primary text-primary-foreground flex size-full items-center justify-center rounded-lg font-bold uppercase">
                        {orbitData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="text-sidebar-foreground grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold uppercase">
                      {orbitData.name || "Select Orbit"}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "h-3.5 w-fit px-1 text-[9px] font-bold tracking-wider uppercase transition-all duration-200 group-data-[collapsible=icon]:hidden",
                        getPlanBadgeColor(orbitData.plan)
                      )}
                    >
                      {orbitData.plan || "free"}
                    </Badge>
                  </div>
                  <HugeiconsIcon
                    icon={UnfoldMoreIcon}
                    className="ml-auto size-4"
                  />
                </SidebarMenuButton>
              }
            />

            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-muted-foreground text-xs">
                  Orbits
                </DropdownMenuLabel>
                {orbits.map((orbit) => (
                  <DropdownMenuItem
                    key={orbit.id}
                    onSelect={() => handleSetActive(orbit.id)}
                    className="cursor-pointer gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border">
                      {orbit.logo ? (
                        <img
                          src={orbit.logo}
                          alt={orbit.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] font-bold uppercase">
                          {orbit.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="flex-1 truncate">{orbit.name}</span>
                    <DropdownMenuShortcut>
                      {activeOrbit?.id === orbit.id && "active"}
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DialogTrigger
                render={
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 p-2"
                    onSelect={(e) => {
                      e.preventDefault()
                      setIsCreateOpen(true)
                    }}
                  >
                    <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                      <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
                    </div>
                    <div className="text-muted-foreground font-medium">
                      Add Orbit
                    </div>
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Orbit
          </DialogTitle>
          <DialogDescription className="text-muted-foreground font-medium">
            Enter a new dimension of productivity. Create a dedicated Orbit for
            your team to collaborate and grow together.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            void form.handleSubmit()
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-4 py-2">
            <div className="bg-muted/30 relative flex size-16 items-center justify-center rounded-xl border border-dashed">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  className="size-full rounded-xl object-cover"
                  alt="Preview"
                />
              ) : (
                <div className="text-muted-foreground px-1 text-center text-[10px] font-medium">
                  Logo (500kb)
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleLogoChange}
                disabled={isUploading}
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Orbit Icon</h4>
              <p className="text-muted-foreground text-xs">
                Optional image representing your orbit.
              </p>
            </div>
          </div>

          <form.Field
            name="name"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  Orbit Name
                </Label>
                <Input
                  id={field.name}
                  placeholder="Acme Inc."
                  className="bg-muted/30 ring-border focus-visible:bg-background focus-visible:ring-primary h-10 rounded-lg ring-1 transition-all focus-visible:ring-2"
                  value={field.state.value}
                  onChange={(e) => {
                    const val = e.target.value
                    field.handleChange(val)
                    const slugValue = val
                      .toLowerCase()
                      .trim()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/[\s_-]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                    form.setFieldValue("slug", slugValue)
                  }}
                  required
                />
              </div>
            )}
          />

          <form.Field
            name="slug"
            children={(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  Orbit Slug
                </Label>
                <InputGroup>
                  <InputGroupAddon className="bg-muted/30">
                    orbit.com/
                  </InputGroupAddon>
                  <Input
                    id={field.name}
                    placeholder="acme-inc"
                    className="bg-muted/30 pl-0 focus-visible:ring-0 disabled:opacity-100"
                    value={field.state.value}
                    disabled
                  />
                </InputGroup>
              </div>
            )}
          />

          <DialogFooter className="mt-2">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50"
                  loading={isSubmitting || isUploading}
                  disabled={!canSubmit || isUploading}
                >
                  Create Orbit
                </Button>
              )}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
