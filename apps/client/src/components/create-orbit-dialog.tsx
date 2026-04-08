import { api } from "@mindorbit/backend/_generated/api"
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
  Input,
  InputGroup,
  InputGroupAddon,
} from "@mindorbit/ui/components/input"
import { Label } from "@mindorbit/ui/components/label"
import { useForm } from "@tanstack/react-form"
import { useMutation } from "convex/react"
import { gooeyToast } from "goey-toast"
import * as React from "react"

import { authClient } from "@/lib/auth-client"

interface CreateOrbitDialogProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function CreateOrbitDialog({
  children,
  open,
  onOpenChange,
}: CreateOrbitDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  )
}

export function CreateOrbitTrigger({ render }: { render: React.ReactElement }) {
  return <DialogTrigger render={render} />
}

export function CreateOrbitContent({ onSuccess }: { onSuccess?: () => void }) {
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState(false)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)

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
        setLogoPreview(null)
        form.reset()
        onSuccess?.()
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

  return (
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
                  mindorbit.com/
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
  )
}
