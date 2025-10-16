import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/Header"
import Link from "next/link"

export function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="absolute top-4 right-4">
                <Header />
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl pt-26">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <Link href="/" className="flex flex-col items-center gap-2">
                        <Logo />
                    </Link>
                    <h1 className="text-4xl font-bold text-center">Terms of Service</h1>
                    <p className="text-muted-foreground text-center">
                        Last updated: October 10, 2025
                    </p>
                </div>

                <div className="mb-4 p-4 border rounded-lg bg-green-100 dark:bg-green-900">
                    <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">Effective Date</h3>
                    <p className="text-green-900 dark:text-green-100">
                        These Terms and Conditions are effective as of October 10, 2025.
                    </p>
                </div>

                <div className="mb-8 p-4 border rounded-lg bg-muted/10 dark:bg-muted/20">
                    <h3 className="text-xl font-semibold mb-2">Summary of Terms:</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                        <li>By using Bubbly, you agree to abide by these Terms of Service.</li>
                        <li>Bubbly is available to all ages, but users under 13 are not knowingly collected.</li>
                        <li>The app is open-source (CC BY-NC 4.0) and user contributions are licensed similarly.</li>
                        <li>You must provide accurate account info and protect your password.</li>
                        <li>Contributions must be lawful, non-misleading, and respect other users’ rights.</li>
                        <li>Bubbly’s software and content are intellectual property of Linus Kang & Linus Kang Software.</li>
                        <li>Your use is subject to the Privacy Policy regarding data collection and usage.</li>
                        <li>Accounts may be terminated for breaches or violations of the Terms or Privacy Policy.</li>
                        <li>Bubbly is not liable for indirect or consequential damages arising from use.</li>
                        <li>These Terms are governed by Australian law, specifically the courts of Queensland.</li>
                        <li>Changes to Terms may occur, with at least 30 days’ notice for material changes.</li>
                    </ul>
                    <br />
                    <p className="text-muted-foreground mb-2">
                        For full details, please read the sections below and the{" "}
                        <Link href="/privacy" className="text-primary underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Welcome to Bubbly (“we,” “our,” or “us”). By accessing or using Bubbly (the “Service”), including the
                            mobile app, website, and any related services, you agree to be bound by these Terms of Service (“Terms”).
                            If you do not agree to these Terms, please do not use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Bubbly is available to all ages. By using the Service, you acknowledge that you are capable of
                            understanding and abiding by these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Licensing</h2>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                <strong>3.1 App License: </strong>The Bubbly app is open-source and licensed under the Creative Commons
                                Attribution-NonCommercial 4.0 International (CC BY-NC 4.0) license. You may use, copy, and modify the
                                app for personal, non-commercial purposes with proper attribution.
                            </li>
                            <li>
                                <strong>3.2 User Contributions: </strong>All user-submitted content, including reviews, photos, and
                                bubbler information, is also licensed under CC BY-NC 4.0. By submitting content, you acknowledge and
                                agree that Bubbly may use, reproduce, display, distribute, or otherwise exploit your submissions in any
                                way permitted under this license.
                            </li>
                            <li>
                                <strong>3.3 Restrictions: </strong> You may not:
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>Submit false reviews or fake bubblers intended to mislead others</li>
                                    <li>Attempt to evade restrictions using alternate accounts</li>
                                    <li>Post content that is inappropriate, offensive, or illegal</li>
                                    <li>Remove copyright or other proprietary notices from the Service or its content</li>
                                    <li>Hack, exploit, or reverse-engineer the app or any part of the Service</li>
                                    <li>Impersonate organisations by creating an account under their name</li>
                                    <li>Do anything on the platform that is considered against these Terms</li>
                                </ul>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. User Accounts</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            When you create an account with us, you must provide accurate, complete, and current information. Failure
                            to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You are responsible for safeguarding the password that you use to access the Service and for any
                            activities or actions under your password. You agree not to disclose your password to any third party.
                            Additionally, any activity occurring under your account is your responsibility.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. User Conduct</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">By using the Bubbly platform, you agree to:</p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                Keep all contributions to the repository and any submissions and interactions appropriate and lawful
                            </li>
                            <li>Avoid misleading other users or manipulating content</li>
                            <li>Respect the rights and privacy of other users</li>
                            <li>
                                Report any security issues responsibly to{" "}
                                <a href="mailto:security@linus.id.au" className="text-primary underline">
                                    {" "}
                                    security@linus.id.au
                                </a>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            The Service and its original content, features, and functionality are and will remain the exclusive
                            property of Linus Kang & Linus Kang Software. The Service is protected by copyright, trademark, and other
                            laws of both Australia and foreign countries.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">This means that:</p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                Bubbly’s original software, design, logos, and other assets are owned by Linus Kang and Linus Kang
                                Software.
                            </li>
                            <li>
                                User submissions fall under the CC BY-NC 4.0 license, granting Bubbly broad rights to use your
                                contributions that you provide to Bubbly.
                            </li>
                            <li>You may not claim ownership over Bubbly’s intellectual property or violate these rights.</li>
                            <li>
                                Any IP concerns should be reported to{" "}
                                <a href="mailto:ip@linus.id.au" className="text-primary underline">
                                    {" "}
                                    ip@linus.id.au
                                </a>
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Your use of Bubbly is subject to our{" "}
                            <a href="/privacy" className="text-primary underline">
                                Privacy Policy
                            </a>
                            , which explains how we collect, use, and protect your personal information. By using the Service, you
                            agree to our privacy practices.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may terminate or suspend your account and bar access to the Service immediately, without prior notice
                            or liability, under our sole discretion, for any reason whatsoever and without limitation, including but
                            not limited to a breach of these Terms or the Privacy Policy.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Upon termination, you can appeal the decision by contacting our appeals team at{" "}
                            <a href="mailto:support@linus.id.au" className="text-primary underline">
                                support@linus.id.au
                            </a>
                            .
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In no event shall Bubbly, nor its directors, employees, partners, agents, suppliers, or affiliates, be
                            liable for any indirect, incidental, special, consequential or punitive damages, including without
                            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access
                            to or use of or inability to access or use the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            These Terms are governed by the laws of Australia. Any disputes arising from these Terms will be resolved
                            exclusively in the courts of Queensland, Australia.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree to indemnify and hold harmless Bubbly, its affiliates, and employees from any claims, damages,
                            or losses resulting from your use of the Service or violation of these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. Data use & scraping</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree not to use automated tools, bots, scripts, or other means to access, extract, copy, or index any data or content from Bubbly without prior written consent. Unauthorized data collection, scraping, or use of the Service for data mining purposes is strictly prohibited and may result in legal action or account termination.
This restriction ensures protection of user privacy, intellectual property, and system integrity.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision
                            is material, we will provide at least 30 days' notice prior to any new terms taking effect. What
                            constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us at{" "}
                            <a href="mailto:support@linus.id.au" className="text-primary underline">
                                support@linus.id.au
                            </a>
                            .
                        </p>
                    </section>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/privacy">
                        <Button variant="outline" className="cursor-pointer bg-transparent">
                            Read the Privacy Policy
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
