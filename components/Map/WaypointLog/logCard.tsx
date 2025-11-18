import { WaypointLog } from "@/types/waypoints"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface WaypointLogCardProps {
  log: WaypointLog
}

export default function WaypointLogCard({ log }: WaypointLogCardProps) {
  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "—"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "None"
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  const getFieldLabel = (key: string): string => {
    const labels: Record<string, string> = {
      name: "Name",
      description: "Description",
      latitude: "Latitude",
      longitude: "Longitude",
      maintainer: "Maintainer",
      region: "Region",
      image: "Image",
      amenities: "Amenities",
      verified: "Verified",
      approved: "Approved",
    }
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  const getActionIcon = () => {
    switch (log.action.toUpperCase()) {
      case "CREATE": return <Plus className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
      case "UPDATE": return <Pencil className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
      case "DELETE": return <Trash2 className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
      default: return null
    }
  }

  const renderChanges = () => {
    if (log.action.toUpperCase() === "CREATE" && log.newData) {
      return Object.entries(log.newData).map(([key, value]) => (
        <div key={key} className="text-xs">
          <span className="text-muted-foreground">{getFieldLabel(key)}:</span>{" "}
          <span className="text-foreground font-medium">{formatValue(value)}</span>
        </div>
      ))
    }

    if (log.action.toUpperCase() === "UPDATE" && log.oldData && log.newData) {
      const changedKeys = Object.keys(log.newData).filter(
        (key) => JSON.stringify(log.oldData![key]) !== JSON.stringify(log.newData![key])
      )

      return changedKeys.map((key) => (
        <div key={key} className="text-xs space-y-0.5">
          <div className="text-muted-foreground font-medium">{getFieldLabel(key)}</div>
          <div className="pl-2 space-y-0.5">
            <div className="text-red-600 dark:text-red-400 line-through opacity-75">
              {formatValue(log.oldData?.[key])}
            </div>
            <div className="text-green-600 dark:text-green-400 font-medium">
              {formatValue(log.newData?.[key])}
            </div>
          </div>
        </div>
      ))
    }

    if (log.action.toUpperCase() === "DELETE" && log.oldData) {
      return Object.entries(log.oldData).map(([key, value]) => (
        <div key={key} className="text-xs">
          <span className="text-muted-foreground">{getFieldLabel(key)}:</span>{" "}
          <span className="text-red-600 dark:text-red-400 line-through">{formatValue(value)}</span>
        </div>
      ))
    }

    return null
  }

  return (
    <div className="group border-l-2 border-border pl-3 pb-3 last:pb-0 hover:border-primary/50 transition-colors relative">
      {/* Timeline dot */}
      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors"></div>
      
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 min-w-0">
          {getActionIcon()}
          <span className="text-sm font-medium text-foreground truncate">
            {log.action.charAt(0) + log.action.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
          <span className="truncate">{log.userId || "System"}</span>
          <span>•</span>
          <span>{formatDate(log.createdAt)}</span>
        </div>
      </div>
      
      <div className="space-y-1.5">
        {renderChanges()}
      </div>
    </div>
  )
}
