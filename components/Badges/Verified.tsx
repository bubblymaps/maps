import { BadgeCheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function Verified() {
    return (
        <Badge variant="secondary" className="bg-blue-500 text-white dark:bg-blue-600">
            <BadgeCheckIcon className="h-4 w-4 text-white flex-shrink-0" />
            Verified
        </Badge>
    )
}