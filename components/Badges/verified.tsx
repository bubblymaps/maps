import type React from "react"
import { Check } from "lucide-react"
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card"

interface VerifiedProps {
  content?: React.ReactNode
}

export function Verified({ content }: VerifiedProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white cursor-pointer 
                        hover:from-blue-600 hover:to-blue-700 hover:scale-110 transition-all duration-200">
          <Check className="h-3 w-3" strokeWidth={2.5} />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 p-3">
        {content || <p className="text-sm text-foreground/90">This is a verified bubbler.</p>}
      </HoverCardContent>
    </HoverCard>
  )
}
