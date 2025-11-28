import Settings from "./settings"

export const metadata = {
  title: "Account Settings | Bubbly Maps",
  description: "Manage your account settings and preferences on Bubbly Maps.",
  openGraph: {
    title: "Account Settings | Bubbly Maps",
    description: "Manage your account settings and preferences on Bubbly Maps.",
    url: "https://bubblymaps.org/settings",
    siteName: "Bubbly Maps",
    type: "website",
  },
};

export default function SettingsPage() {
  return <Settings />
}