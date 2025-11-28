import Onboarding from "./onboarding"

export const metadata = {
  title: "Welcome to Bubbly Maps | Onboarding",
  description: "Complete your profile setup on Bubbly Maps.",
  openGraph: {
    title: "Welcome to Bubbly Maps | Onboarding",
    description: "Complete your profile setup on Bubbly Maps.",
    url: "https://bubblymaps.org/onboarding",
    siteName: "Bubbly Maps",
    type: "website",
  },
};

export default function OnboardingPage() {
  return <Onboarding />
}
