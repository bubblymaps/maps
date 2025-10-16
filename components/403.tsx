import { Header } from "@/components/Header"

export default function NoAccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute top-4 right-4">
        <Header />
      </div>
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <div className="flex flex-col gap-4">
          <h1 className="text-9xl font-bold text-foreground tracking-tight">:(</h1>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold text-foreground">Access Denied</h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            You do not have permission to access this resouce.
          </p>
        </div>
      </div>
    </div>
  )
}
