import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Header } from "@/components/Header"

export function PrivacyPage() {
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
                    <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
                    <p className="text-muted-foreground text-center">
                        Last updated: October 10, 2025
                    </p>
                </div>

                <div className="mb-4 p-4 border rounded-lg bg-green-100 dark:bg-green-900">
                    <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">Effective Date</h3>
                    <p className="text-green-900 dark:text-green-100">
                        This Privacy Policy is effective as of October 10, 2025.
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <div className="mb-8 p-4 border rounded-lg bg-muted/10 dark:bg-muted/20">
                        <h3 className="text-xl font-semibold mb-2">In short:</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                            <li>We collect account info, contributions, and feedback.</li>
                            <li>
                                We use IPs, device info, and location (with permission) for analytics and showing nearby bubblers.
                            </li>
                            <li>We use cookies and local storage to keep you signed in and remember preferences like app theme.</li>
                            <li>
                                We do <strong>not</strong> sell your personal data.
                            </li>
                            <li>You can access, delete, or export your data at any time by contacting us.</li>
                            <li>Our service is safe for all ages; we do not knowingly collect info from children under 13.</li>
                        </ul>
                        <br />
                        <p className="text-muted-foreground mb-2">
                            We still recommend reading the full Privacy Policy, as it helps you understand exactly how your
                            information is handled and how to exercise your rights.
                        </p>
                    </div>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Welcome to Bubbly (“we,” “our,” or “us”). Bubbly is a community-driven app that helps people find and
                            share locations and information about public water bubblers. This Privacy Policy explains how we handle
                            your information when you use our app or website.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We collect certain information to make Bubbly work properly, keep accounts secure, and improve the app
                            over time.
                        </p>

                        <h3 className="text-lg font-medium mb-2">a. Information You Provide</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                <span className="font-semibold">Account details:</span> If you sign in using an OAuth provider (such as
                                Google, Discord, or Apple), we receive your name, profile picture, and email address from that provider.
                            </li>
                            <li>
                                <span className="font-semibold">User contributions:</span> Information you submit about water bubblers,
                                including descriptions, locations, and photos.
                            </li>
                            <li>
                                <span className="font-semibold">Feedback and contact:</span> Details you include when reporting issues
                                or contacting us directly.
                            </li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">b. Information Collected Automatically</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                <span className="font-semibold">IP address:</span> Used for analytics, security, and preventing abuse.
                            </li>
                            <li>
                                <span className="font-semibold">Device and browser info:</span> Such as operating system and app version
                                for analytics.
                            </li>
                            <li>
                                <span className="font-semibold">Location data:</span> If you grant permission, we use your approximate
                                location to show nearby bubblers. This data isn’t stored long-term and is completely anonymous when
                                stored temporarily in our database.
                            </li>
                            <li>
                                <span className="font-semibold">Cookies and local storage:</span> Used to keep you signed in and
                                remember your preferences like app theme.
                            </li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2">c. Information from Third Parties</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            If you log in using a third-party OAuth provider, they may share limited profile information according to
                            their own privacy settings. You can control this through your provider’s account settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Provide, maintain, and improve our services</li>
                            <li>Authenticate users and manage sessions</li>
                            <li>Display nearby bubblers and user submissions</li>
                            <li>Respond to feedback or bug reports</li>
                            <li>Improve app performance and security</li>
                            <li>Monitor usage to prevent spam or abuse</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We do <strong>not</strong> sell your personal data or use it for advertising
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share your information in the following circumstances:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                <strong>With your consent:</strong> e.g. if you choose to share bubbler submissions publicly.
                            </li>
                            <li>
                                <strong>Service providers:</strong> We may share your information with third-party service providers who
                                perform services on our behalf (e.g. hosting services, oauth, analytics, or map APIs).
                            </li>
                            <li>
                                <strong>Legal requirements:</strong> We may disclose your information if required to do so by law or in
                                response to valid requests by public authorities.
                            </li>
                            <li>
                                <strong>Security:</strong> We may disclose your information in regards to investigating or preventing
                                fraud or misuse of the platform.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We implement appropriate technical and organizational security measures to protect your personal
                            information. However, please note that no method of transmission over the Internet or method of electronic
                            storage is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                            Privacy Policy, unless a longer retention period is required or permitted by law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal information, including but
                            not limited to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>The right to access and export your personal information</li>
                            <li>The right to delete your personal information</li>
                            <li>Withdraw consent or disable location access</li>
                            <li>The right to data portability</li>
                            <li>File a complaint with your local data authority</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To exercise any of these rights, or if you have questions about your data, please contact us at
                            <a href="mailto:privacy@linus.id.au" className="text-primary underline hover:text-primary/80">
                                {" "}
                                privacy@linus.id.au
                            </a>
                            . We will respond promptly and help you manage your personal information in accordance with applicable
                            law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking Technologies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to track activity on our service and hold certain
                            information like session tokens to keep you signed in, and remember your preferences. Cookies are files
                            with a small amount of data which may include an anonymous unique identifier. You can clear this
                            information anytime through your browser or device settings.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Third-Party Services</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Our service may use third-party websites or services that are not owned or controlled by us such as:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>
                                <strong>OAuth Providers: </strong>Google Cloud OAuth & Resend
                            </li>
                            <li>
                                <strong>Analytics: </strong>Google Analytics
                            </li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We have no control over and assume no responsibility for the content, privacy policies, or practices of
                            any third-party websites or services.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Bubbly is designed for users of all ages. We do not knowingly collect personal information (like
                            birthdays) from children under 13. If you are a parent or guardian and believe your child has shared
                            information with us, please contact us at
                            <a href="mailto:privacy@linus.id.au" className="text-primary underline hover:text-primary/80">
                                {" "}
                                privacy@linus.id.au
                            </a>
                            , and we will take steps to remove it.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you have any questions or privacy-related requests, please contact us at:{" "}
                            <a href="mailto:privacy@linus.id.au" className="text-primary underline hover:text-primary/80">
                                {" "}
                                privacy@linus.id.au
                            </a>
                            .
                        </p>
                    </section>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/terms">
                        <Button variant="outline" className="cursor-pointer bg-transparent">
                            View the Terms
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
