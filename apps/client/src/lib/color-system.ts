export const semanticColors = {
  text: {
    title: "text-foreground",
    body: "text-muted-foreground",
    primary: "text-primary",
    inverse: "text-primary-foreground",
  },
  surface: {
    app: "bg-background",
    card: "bg-card text-card-foreground",
    muted: "bg-muted",
    mutedSoft: "bg-muted/50",
    primary: "bg-primary",
    primarySoft: "bg-primary/10",
    destructiveSoft: "bg-destructive/10",
  },
  border: {
    default: "border-border",
    soft: "border-border/50",
    primary: "border-primary/20",
    destructive: "border-destructive/20",
  },
  ring: {
    default: "ring-border",
    primary: "ring-primary",
    muted: "ring-muted/50",
  },
  action: {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-background text-foreground hover:bg-muted",
    muted: "bg-muted text-foreground hover:bg-muted/80",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  },
  badge: {
    primary: "border-primary/20 bg-primary/10 text-primary",
    muted: "border-border bg-muted text-muted-foreground",
    destructive: "border-destructive/20 bg-destructive/10 text-destructive",
  },
} as const
