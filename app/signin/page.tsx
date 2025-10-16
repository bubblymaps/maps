import { Login } from "@/components/SignIn/SignIn"

export const metadata = {
  title: "Sign in | Bubbly Maps",
};

export default function Page() {
    return (
        <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <Login />
            </div>
        </div>
    )
}