import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
import Header from "@/components/header"

export const metadata = {
  title: "Privacy Policy | Bubbly Maps",
  description: "Read about how we handle your data and protect your privacy on Bubbly Maps.",
  openGraph: {
    title: "Privacy Policy | Bubbly Maps",
    description: "Read about how we handle your data and protect your privacy on Bubbly Maps.",
    url: "https://bubblymaps.org/privacy",
    siteName: "Bubbly Maps",
    type: "website",
  },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <h1 className="text-4xl font-bold text-center">Privacy Policy</h1>
                    <p className="text-muted-foreground text-center">
                        Last updated: November 16, 2025
                    </p>
                </div>

                <div className="mb-4 p-4 border rounded-lg bg-green-100 dark:bg-green-900">
                    <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">Effective Date</h3>
                    <p className="text-green-900 dark:text-green-100">
                        This Privacy Policy is effective as of November 16, 2025.
                    </p>
                </div>

                <div className="mb-8 p-4 border rounded-lg bg-muted/10 dark:bg-muted/20">
                    <h3 className="text-xl font-semibold mb-2">Privacy at a Glance:</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                        <li>We collect account info (name, email, profile picture) via OAuth providers</li>
                        <li>We collect IP addresses, device info, and location data (with your permission)</li>
                        <li>Location data is used only to show nearby water fountains and is anonymized</li>
                        <li>We use cookies and local storage for authentication and preferences</li>
                        <li>We do NOT sell, rent, or share your personal data for advertising purposes</li>
                        <li>Your bubbler submissions are public and licensed under CC BY-NC 4.0</li>
                        <li>You can access, export, correct, or delete your data at any time</li>
                        <li>We retain data as long as your account is active or as legally required</li>
                        <li>Children under 13 require parental consent; we don't knowingly collect their data</li>
                        <li>We're based in Queensland, Australia and comply with Australian Privacy Principles</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 text-sm">
                        For complete details about your privacy rights and our data practices, please read the full policy below.
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction and Scope</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>1.1 About This Policy:</strong> Welcome to Bubbly Maps ("Bubbly," "we," "our," or "us").
                            This Privacy Policy explains how we collect, use, store, protect, and share your personal information
                            when you use the Bubbly Maps mobile app, website, API, and any related services (collectively, the "Service").
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>1.2 Acceptance:</strong> By accessing or using the Service, you acknowledge that you have read,
                            understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and
                            practices, you must not use the Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>1.3 Relationship to Terms:</strong> This Privacy Policy works together with our Terms of Service.
                            Where there is any conflict between the two documents, the Terms of Service shall prevail.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>1.4 Controller Information:</strong> The data controller responsible for your personal information is
                            Linus Kang Software, operating as Bubbly Maps, located in Queensland, Australia. For privacy-related
                            inquiries, contact us at privacy@linus.id.au.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We collect several types of information to provide, maintain, protect, and improve our Service. The
                            information we collect falls into three main categories:
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">2.1 Information You Provide Directly</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Account Information:</strong> When you create an account or sign in using an OAuth provider
                            (Google, Discord, Apple, GitHub, or other supported providers), we collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Full name or display name</li>
                            <li>Email address</li>
                            <li>Profile picture or avatar</li>
                            <li>Unique identifier from the OAuth provider</li>
                            <li>OAuth tokens (stored securely and used only for authentication)</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>User-Generated Content:</strong> Information you submit while using the Service, including:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Water fountain (bubbler) locations and GPS coordinates</li>
                            <li>Descriptions, reviews, and ratings of water fountains</li>
                            <li>Photos and images you upload</li>
                            <li>Comments, feedback, and community contributions</li>
                            <li>Edits, corrections, or updates to existing fountain data</li>
                            <li>Tags, categories, and accessibility information</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Communications:</strong> When you contact us, we collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Email correspondence and support tickets</li>
                            <li>Bug reports and feature requests</li>
                            <li>Feedback and survey responses</li>
                            <li>Security vulnerability reports</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">2.2 Information Collected Automatically</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Device and Usage Information:</strong> When you use the Service, we automatically collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>IP address and approximate geographic location derived from IP</li>
                            <li>Device type, model, and operating system</li>
                            <li>Browser type and version</li>
                            <li>App version and build number</li>
                            <li>Screen resolution and device settings</li>
                            <li>Language and timezone settings</li>
                            <li>Referral source and pages visited</li>
                            <li>Time spent on pages and interaction patterns</li>
                            <li>Crash logs and error reports</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Location Data:</strong> With your explicit permission, we collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Precise GPS coordinates (when adding or viewing water fountains)</li>
                            <li>Approximate location to show nearby fountains on the map</li>
                            <li>Location access is optional and can be denied or revoked at any time</li>
                            <li>Location data used for distance calculations is anonymized and not stored permanently</li>
                            <li>We do NOT track your location continuously or in the background</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Cookies and Similar Technologies:</strong> We use the following tracking technologies:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Session Cookies:</strong> Essential cookies that keep you logged in (expires when session ends)</li>
                            <li><strong>Authentication Tokens:</strong> Secure tokens for OAuth authentication</li>
                            <li><strong>Preference Cookies:</strong> Remember your theme, language, and display preferences (persistent)</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
                            <li><strong>Local Storage:</strong> Store app state, cached data, and user preferences locally on your device</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">2.3 Information from Third Parties</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>OAuth Providers:</strong> When you authenticate using third-party OAuth providers, they share
                            limited profile information according to their privacy policies and your account settings. We receive
                            only the information necessary for authentication (name, email, profile picture, unique identifier).
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Map Services:</strong> We use third-party mapping services (such as Google Maps, Mapbox, or
                            OpenStreetMap) which may collect data according to their own privacy policies when you interact with maps.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Analytics Providers:</strong> We use analytics services (Google Analytics, Vercel Analytics)
                            that may collect aggregate, anonymized usage data.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">2.4 Information We Do NOT Collect</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For clarity, we explicitly do NOT collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Biometric data (fingerprints, facial recognition, etc.)</li>
                            <li>Health or medical information</li>
                            <li>Financial information (credit cards, bank accounts, payment details)</li>
                            <li>Government-issued identification numbers (passport, driver's license, social security numbers)</li>
                            <li>Background location tracking when the app is closed</li>
                            <li>Contact lists or address books from your device</li>
                            <li>Personal information from children under 13 without parental consent</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We use the information we collect for the following purposes:
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.1 Service Provision and Functionality</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Create, maintain, and authenticate user accounts</li>
                            <li>Display water fountain locations on interactive maps</li>
                            <li>Calculate distances to nearby fountains based on your location</li>
                            <li>Enable you to add, edit, and review water fountain information</li>
                            <li>Personalize your experience with saved favorites and preferences</li>
                            <li>Provide search and filtering functionality</li>
                            <li>Process and display your contributions to the community database</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.2 Communication and Support</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Respond to your support requests, questions, and feedback</li>
                            <li>Send important service notifications and updates</li>
                            <li>Notify you about changes to our Terms of Service or Privacy Policy</li>
                            <li>Communicate about your account status or violations of our policies</li>
                            <li>Investigate and respond to security or abuse reports</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.3 Security and Abuse Prevention</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Detect and prevent fraud, spam, vandalism, and abuse</li>
                            <li>Identify fake or malicious accounts</li>
                            <li>Monitor for automated scraping or API abuse</li>
                            <li>Enforce our Terms of Service and community guidelines</li>
                            <li>Protect against security threats and unauthorized access</li>
                            <li>Investigate violations and take appropriate enforcement actions</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.4 Analytics and Improvement</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Analyze usage patterns and feature popularity</li>
                            <li>Understand how users interact with the Service</li>
                            <li>Identify bugs, crashes, and performance issues</li>
                            <li>Test new features and improvements</li>
                            <li>Generate aggregate, anonymized statistics about Service usage</li>
                            <li>Improve user experience, design, and functionality</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.5 Legal Compliance and Protection</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Comply with applicable laws, regulations, and legal obligations</li>
                            <li>Respond to lawful requests from government authorities</li>
                            <li>Protect our rights, property, and safety</li>
                            <li>Enforce our legal agreements and policies</li>
                            <li>Defend against legal claims or disputes</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">3.6 What We DON'T Do With Your Data</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We explicitly DO NOT:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Sell your personal information to third parties</li>
                            <li>Rent or lease your data to advertisers or data brokers</li>
                            <li>Use your data for targeted advertising or behavioral profiling</li>
                            <li>Share your email address with marketing companies</li>
                            <li>Track your location when the app is not in use</li>
                            <li>Use your photos for purposes other than displaying fountain information</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Legal Basis for Processing (GDPR & Australian Privacy Principles)</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For users in the European Union, United Kingdom, or other jurisdictions with similar data protection laws,
                            our legal basis for processing your personal information includes:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Consent:</strong> When you provide explicit consent (e.g., location access, cookie preferences)</li>
                            <li><strong>Contract Performance:</strong> Processing necessary to provide the Service you've requested</li>
                            <li><strong>Legitimate Interests:</strong> For analytics, security, fraud prevention, and Service improvement</li>
                            <li><strong>Legal Obligations:</strong> When required by law to retain or disclose information</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For Australian users, we comply with the Australian Privacy Principles (APPs) under the Privacy Act 1988.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. How We Share Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share your information in the following circumstances:
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.1 Public Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Community Contributions:</strong> Information you submit about water fountains (locations,
                            descriptions, photos, ratings, reviews) is PUBLIC and visible to all users. This content is licensed
                            under Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0), which means:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Other users can view, copy, and use your contributions</li>
                            <li>Third parties can access this data through our API or website</li>
                            <li>Attribution may be provided via your username or anonymized contributor ID</li>
                            <li>Commercial use requires separate authorization from us</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.2 Service Providers and Business Partners</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We share information with trusted third-party service providers who help us operate the Service:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Cloud Hosting:</strong> Infrastructure providers that host our servers and databases (e.g., AWS, Vercel, Railway)</li>
                            <li><strong>Authentication Services:</strong> OAuth providers (Google, Discord, Apple, GitHub) for secure login</li>
                            <li><strong>Email Services:</strong> Email delivery providers for transactional communications (Resend)</li>
                            <li><strong>Analytics:</strong> Usage analytics and error tracking (Google Analytics, Vercel Analytics, Sentry)</li>
                            <li><strong>Map Services:</strong> Mapping and geocoding APIs (Google Maps, Mapbox, OpenStreetMap)</li>
                            <li><strong>CDN and Media Storage:</strong> Content delivery networks for photos and media (Cloudflare, AWS S3)</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            These service providers are contractually obligated to protect your information and can only use it
                            to perform services on our behalf. They cannot use your data for their own purposes.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.3 Legal Requirements and Protection</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may disclose your information if required to do so by law or in response to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Valid legal processes (subpoenas, court orders, warrants)</li>
                            <li>Requests from law enforcement or government authorities</li>
                            <li>National security or public safety concerns</li>
                            <li>Protection of our rights, property, or safety, or that of users or the public</li>
                            <li>Investigation of fraud, abuse, or violations of our Terms of Service</li>
                            <li>Defense of legal claims or enforcement of our policies</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.4 Business Transfers</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If Bubbly Maps is involved in a merger, acquisition, asset sale, bankruptcy, or other business transaction,
                            your information may be transferred as part of that transaction. We will notify you via email and/or
                            prominent notice on the Service before your information becomes subject to a different privacy policy.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.5 With Your Consent</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share your information for purposes not described in this Privacy Policy with your explicit consent.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">5.6 Aggregate and Anonymized Data</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We may share aggregate, anonymized, or de-identified information that cannot reasonably be used to
                            identify you. For example, we may publish statistics about water fountain density in different regions
                            or overall usage trends.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Data Security and Protection</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>6.1 Security Measures:</strong> We implement appropriate technical and organizational security
                            measures to protect your personal information against unauthorized access, alteration, disclosure, or
                            destruction. Our security practices include:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Encryption of data in transit using TLS/SSL protocols</li>
                            <li>Encryption of sensitive data at rest in our databases</li>
                            <li>Secure OAuth authentication flows with industry-standard providers</li>
                            <li>Regular security audits and vulnerability assessments</li>
                            <li>Access controls and authentication for our systems</li>
                            <li>Monitoring for suspicious activity and unauthorized access attempts</li>
                            <li>Regular backups with secure storage</li>
                            <li>Staff training on data protection and security best practices</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>6.2 Limitations:</strong> While we implement strong security measures, no method of electronic
                            transmission or storage is 100% secure. We cannot guarantee absolute security of your information. You
                            use the Service at your own risk and are responsible for maintaining the confidentiality of your account
                            credentials.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>6.3 Data Breach Notification:</strong> In the event of a data breach that affects your personal
                            information, we will notify you and relevant authorities as required by applicable law. We will provide
                            information about the nature of the breach, the data affected, and steps we are taking to address it.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>6.4 Account Security:</strong> You are responsible for:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Maintaining the security of your OAuth provider account</li>
                            <li>Not sharing your account access with others</li>
                            <li>Immediately notifying us if you suspect unauthorized access to your account</li>
                            <li>Logging out after using shared or public devices</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Data Retention and Deletion</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.1 Retention Period:</strong> We retain your personal information for as long as necessary to
                            fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or
                            permitted by law. Specific retention periods include:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period
                                after deletion to prevent fraud and comply with legal obligations</li>
                            <li><strong>User Contributions:</strong> Public contributions (fountain locations, reviews, photos) may be
                                retained indefinitely as part of the community database, but will be anonymized after account deletion</li>
                            <li><strong>Usage Logs:</strong> Typically retained for 90-180 days for security and analytics purposes</li>
                            <li><strong>IP Addresses:</strong> Retained for up to 12 months for security and abuse prevention</li>
                            <li><strong>Support Communications:</strong> Retained for up to 3 years for customer service and legal purposes</li>
                            <li><strong>Legal Hold Data:</strong> Retained as required for legal proceedings, investigations, or compliance</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.2 Account Deletion:</strong> When you delete your account:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Your account information (name, email, profile picture) is permanently deleted</li>
                            <li>Your authentication tokens and session data are immediately revoked</li>
                            <li>Public contributions are anonymized but may remain visible (as they're part of the community database)</li>
                            <li>Some data may be retained in encrypted backups for up to 90 days</li>
                            <li>We may retain certain information for legal, security, or fraud prevention purposes</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.3 Content Persistence:</strong> Important note about your public contributions: Water fountain
                            locations, reviews, photos, and other submissions become part of the community database under CC BY-NC 4.0
                            license. While these contributions will be anonymized when you delete your account, they cannot be
                            completely removed as they provide value to the community and may have been relied upon by other users.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.4 Inactive Accounts:</strong> Accounts that remain inactive (no login) for more than 3 years may
                            be automatically deleted after notice is sent to the registered email address.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Your Privacy Rights and Choices</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Depending on your location, you may have certain rights regarding your personal information:
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.1 Access and Portability</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Access:</strong> You can request a copy of all personal information we hold about you</li>
                            <li><strong>Right to Portability:</strong> You can request your data in a structured, commonly used,
                                machine-readable format (JSON, CSV)</li>
                            <li><strong>How to Request:</strong> Email privacy@linus.id.au with your account email address. We will
                                verify your identity and provide the data within 30 days</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.2 Correction and Update</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Correction:</strong> You can update your account information directly in app settings</li>
                            <li>If you cannot update information yourself, email us at privacy@linus.id.au</li>
                            <li>We will correct inaccurate or incomplete data within 30 days</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.3 Deletion and Erasure</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Deletion:</strong> You can request deletion of your account and personal information</li>
                            <li><strong>How to Delete:</strong> Email privacy@linus.id.au or use the account deletion feature in app settings</li>
                            <li><strong>Limitations:</strong> We may retain certain data for legal compliance, fraud prevention, or
                                where public contributions are part of the community database (which will be anonymized)</li>
                            <li>Deletion is typically completed within 30 days</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.4 Opt-Out and Consent Withdrawal</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Location Access:</strong> You can revoke location permissions at any time through your device
                                settings. The app will still function but won't show distance calculations or nearby fountains</li>
                            <li><strong>Email Communications:</strong> You can opt out of non-essential emails by using the unsubscribe
                                link in any email we send</li>
                            <li><strong>Analytics Cookies:</strong> You can disable analytics cookies through browser settings, though
                                this may affect functionality</li>
                            <li><strong>Consent Withdrawal:</strong> You can withdraw consent for data processing at any time, though
                                this may limit your ability to use certain features</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.5 Object and Restrict Processing</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Object:</strong> You can object to processing of your data based on legitimate interests</li>
                            <li><strong>Right to Restrict:</strong> You can request restriction of processing in certain circumstances
                                (e.g., while we verify accuracy of data)</li>
                            <li>Contact privacy@linus.id.au to exercise these rights</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.6 Complaint and Regulatory Contact</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Complain:</strong> You have the right to lodge a complaint with a supervisory authority</li>
                            <li><strong>Australian Users:</strong> Contact the Office of the Australian Information Commissioner (OAIC)
                                at oaic.gov.au</li>
                            <li><strong>EU/UK Users:</strong> Contact your local data protection authority</li>
                            <li>We encourage you to contact us first at privacy@linus.id.au so we can attempt to resolve your concerns</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">8.7 How to Exercise Your Rights</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To exercise any of these rights:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Email privacy@linus.id.au with your request</li>
                            <li>Include your registered email address for verification</li>
                            <li>Specify which right(s) you wish to exercise</li>
                            <li>We will respond within 30 days (may be extended to 60 days for complex requests)</li>
                            <li>We may request additional information to verify your identity</li>
                            <li>There is no fee for exercising your rights unless requests are manifestly unfounded or excessive</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Cookies and Tracking Technologies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>9.1 What Are Cookies:</strong> Cookies are small text files placed on your device when you use
                            our Service. They help us recognize your device and remember information about your visit.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">9.2 Types of Cookies We Use</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Essential Cookies (Always Active):</strong>
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Authentication Cookies:</strong> Keep you logged in and maintain your session (session-based)</li>
                            <li><strong>Security Cookies:</strong> Detect and prevent security threats, abuse, and fraudulent activity</li>
                            <li><strong>Load Balancing Cookies:</strong> Distribute traffic across servers for optimal performance</li>
                            <li>These cookies are strictly necessary and cannot be disabled without breaking core functionality</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Functional Cookies (Can Be Disabled):</strong>
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Preference Cookies:</strong> Remember your theme (light/dark mode), language, and display settings</li>
                            <li><strong>Map Settings:</strong> Remember your preferred map view, zoom level, and layer selections</li>
                            <li><strong>Persistent for:</strong> Up to 1 year or until you clear browser data</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Analytics Cookies (Can Be Disabled):</strong>
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Google Analytics:</strong> Understand how users interact with the Service, which pages are
                                visited, and how long users stay</li>
                            <li><strong>Vercel Analytics:</strong> Track page performance, load times, and technical metrics</li>
                            <li><strong>Error Tracking:</strong> Capture crash reports and error logs to improve stability</li>
                            <li><strong>Data collected:</strong> Page views, referral source, device type, general location (city/region)</li>
                            <li><strong>Persistent for:</strong> Up to 2 years</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">9.3 Local Storage and Session Storage</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In addition to cookies, we use browser local storage and session storage to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Cache map data for faster loading</li>
                            <li>Store your recently viewed fountains</li>
                            <li>Maintain app state between page refreshes</li>
                            <li>Remember your search history and filters</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">9.4 Managing Cookies</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You can control cookies through:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete existing cookies</li>
                            <li><strong>Opt-Out Tools:</strong> Use browser extensions like Privacy Badger or uBlock Origin</li>
                            <li><strong>Google Analytics Opt-Out:</strong> Install the Google Analytics Opt-Out Browser Add-on</li>
                            <li><strong>Do Not Track:</strong> We respect browser "Do Not Track" (DNT) signals where technically feasible</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Note: Disabling essential cookies will prevent you from logging in and using core features of the Service.
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">9.5 Third-Party Cookies</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Some third-party services we use may set their own cookies:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Google Maps:</strong> May set cookies for map functionality and usage tracking</li>
                            <li><strong>OAuth Providers:</strong> Google, Discord, Apple, and GitHub may set cookies during authentication</li>
                            <li><strong>CDN Providers:</strong> Content delivery networks may set cookies for performance optimization</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            We do not control these third-party cookies. Please review their privacy policies for more information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Third-Party Services and Links</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.1 Third-Party Services We Use:</strong> Our Service integrates with and relies on several
                            third-party services, each with their own privacy policies:
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">Authentication Providers</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Google OAuth:</strong> For Google account sign-in - <a href="https://policies.google.com/privacy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Discord OAuth:</strong> For Discord account sign-in - <a href="https://discord.com/privacy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Apple Sign-In:</strong> For Apple ID authentication - <a href="https://www.apple.com/legal/privacy/" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>GitHub OAuth:</strong> For GitHub account sign-in - <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" className="text-primary underline">Privacy Policy</a></li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">Infrastructure and Hosting</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Vercel:</strong> Website and app hosting - <a href="https://vercel.com/legal/privacy-policy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Railway/AWS/Google Cloud:</strong> Database and backend hosting - respective privacy policies apply</li>
                            <li><strong>Cloudflare:</strong> CDN, security, and DDoS protection - <a href="https://www.cloudflare.com/privacypolicy/" className="text-primary underline">Privacy Policy</a></li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">Analytics and Monitoring</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Google Analytics:</strong> Usage analytics - <a href="https://policies.google.com/privacy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Vercel Analytics:</strong> Performance monitoring - <a href="https://vercel.com/legal/privacy-policy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Sentry (if used):</strong> Error tracking - <a href="https://sentry.io/privacy/" className="text-primary underline">Privacy Policy</a></li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">Communication Services</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Resend:</strong> Email delivery service - <a href="https://resend.com/legal/privacy-policy" className="text-primary underline">Privacy Policy</a></li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">Mapping Services</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Google Maps:</strong> Interactive maps and geocoding - <a href="https://policies.google.com/privacy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>Mapbox (if used):</strong> Alternative mapping - <a href="https://www.mapbox.com/legal/privacy" className="text-primary underline">Privacy Policy</a></li>
                            <li><strong>OpenStreetMap:</strong> Map data source - <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" className="text-primary underline">Privacy Policy</a></li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.2 No Control Over Third Parties:</strong> We have no control over and assume no responsibility
                            for the content, privacy policies, or practices of any third-party services. These services may collect,
                            use, and share data according to their own policies.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.3 External Links:</strong> The Service may contain links to third-party websites, blogs, or
                            resources. We are not responsible for the privacy practices of these external sites. We encourage you to
                            read the privacy policies of every website you visit.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.4 Data Processing Agreements:</strong> Where required by law, we maintain data processing
                            agreements with third-party service providers to ensure they handle your data in compliance with applicable
                            privacy regulations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Children's Privacy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.1 Age Requirements:</strong> The Service is designed to be family-friendly and suitable for
                            users of all ages. However, consistent with our Terms of Service:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Users must be at least 13 years old to create an account</li>
                            <li>Users between 13-17 years old must have parental or guardian consent</li>
                            <li>We do not knowingly collect personal information from children under 13 without verified parental consent</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.2 COPPA Compliance:</strong> We comply with the Children's Online Privacy Protection Act (COPPA)
                            for US users. We do not knowingly collect, use, or disclose personal information from children under 13
                            without verifiable parental consent.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.3 What We Don't Collect from Children:</strong> We do not collect:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Birth dates or age information beyond OAuth provider verification</li>
                            <li>School or educational information</li>
                            <li>Phone numbers or home addresses</li>
                            <li>Photos of children (user-uploaded fountain photos should not contain identifiable individuals)</li>
                            <li>Precise location tracking for minors</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.4 Parental Rights:</strong> Parents and guardians have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Review personal information collected from their child</li>
                            <li>Request deletion of their child's personal information</li>
                            <li>Refuse further collection or use of their child's information</li>
                            <li>Contact us at privacy@linus.id.au to exercise these rights</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.5 Discovery of Underage Users:</strong> If we discover that we have collected personal information
                            from a child under 13 without verified parental consent, we will delete that information as quickly as
                            possible. If you believe we have collected information from a child under 13, please contact us immediately
                            at privacy@linus.id.au.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. International Data Transfers</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.1 Global Service:</strong> Bubbly Maps operates globally and is controlled from Queensland,
                            Australia. Your information may be transferred to, stored, and processed in Australia, the United States,
                            or other countries where our service providers operate.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.2 Data Protection Standards:</strong> These countries may have data protection laws that differ
                            from those in your country. However, we take steps to ensure your information receives an adequate level
                            of protection wherever it is processed:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>We use service providers that comply with internationally recognized data protection standards</li>
                            <li>We implement appropriate safeguards such as standard contractual clauses</li>
                            <li>We encrypt data in transit and at rest</li>
                            <li>We conduct vendor security assessments</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.3 EU and UK Users:</strong> For users in the European Union or United Kingdom, we rely on the
                            following legal mechanisms for international data transfers:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                            <li>Adequacy decisions where applicable</li>
                            <li>Your explicit consent for transfers where other mechanisms are not available</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.4 Australian Privacy Principles:</strong> We comply with the Australian Privacy Principles (APPs)
                            under the Privacy Act 1988, which includes requirements for cross-border disclosure of personal information.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">13. California Privacy Rights (CCPA/CPRA)</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            If you are a California resident, you have additional rights under the California Consumer Privacy Act
                            (CCPA) and California Privacy Rights Act (CPRA):
                        </p>

                        <h3 className="text-lg font-medium mb-2 mt-6">13.1 Your California Rights</h3>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Right to Know:</strong> You can request disclosure of the categories and specific pieces of
                                personal information we collect, use, disclose, and sell</li>
                            <li><strong>Right to Delete:</strong> You can request deletion of your personal information</li>
                            <li><strong>Right to Correct:</strong> You can request correction of inaccurate personal information</li>
                            <li><strong>Right to Opt-Out:</strong> You can opt out of the sale or sharing of personal information</li>
                            <li><strong>Right to Limit:</strong> You can limit use of sensitive personal information</li>
                            <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your rights</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">13.2 Categories of Information We Collect</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            In the past 12 months, we have collected the following categories of personal information:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Identifiers (name, email, IP address)</li>
                            <li>Internet activity (browsing history, search history, interaction with Service)</li>
                            <li>Geolocation data (approximate and precise location with permission)</li>
                            <li>Visual information (profile pictures, user-uploaded photos)</li>
                            <li>Inferences (preferences, characteristics, behavior)</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">13.3 Sale and Sharing of Personal Information</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>We do NOT sell your personal information for monetary compensation.</strong> However, under the
                            broad CCPA definition, sharing data with analytics providers may be considered a "sale" or "share":
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>We share usage data with Google Analytics for analytics purposes</li>
                            <li>This may be considered "sharing" under CCPA even though we receive no payment</li>
                            <li>You can opt out by disabling analytics cookies or emailing privacy@linus.id.au</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">13.4 How to Exercise Your California Rights</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            To exercise your California privacy rights:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Email: privacy@linus.id.au with "California Privacy Rights" in the subject line</li>
                            <li>Include: Your name, email address, and specific request</li>
                            <li>We will verify your identity before processing requests</li>
                            <li>Response time: Within 45 days (may extend to 90 days for complex requests)</li>
                            <li>You may designate an authorized agent to make requests on your behalf</li>
                        </ul>

                        <h3 className="text-lg font-medium mb-2 mt-6">13.5 Shine the Light</h3>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Under California Civil Code Section 1798.83, California residents can request information about personal
                            information we share with third parties for their marketing purposes. We do not share personal information
                            with third parties for their direct marketing purposes.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">14. Changes to This Privacy Policy</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.1 Right to Modify:</strong> We reserve the right to modify, amend, or update this Privacy
                            Policy at any time to reflect changes in our practices, technology, legal requirements, or other factors.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.2 Notification of Changes:</strong> We will notify you of material changes by:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Posting a prominent notice on the Service</li>
                            <li>Updating the "Last Updated" date at the top of this Privacy Policy</li>
                            <li>Sending an email to your registered email address for significant changes</li>
                            <li>Displaying an in-app notification</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.3 Material Changes:</strong> For material changes that reduce your rights or significantly
                            change how we collect, use, or share your information, we will provide at least 30 days' advance notice.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.4 Acceptance:</strong> Your continued use of the Service after any modifications indicates
                            your acceptance of the updated Privacy Policy. If you do not agree to the modified Privacy Policy, you
                            must stop using the Service and may delete your account.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.5 Previous Versions:</strong> We will maintain an archive of previous versions of this Privacy
                            Policy for your reference. You can request access to previous versions by emailing privacy@linus.id.au.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">15. Contact Information and Data Protection Officer</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.1 Privacy Inquiries:</strong> For questions, concerns, or requests regarding this Privacy
                            Policy or our data practices, please contact us at:
                        </p>
                        <ul className="list-none pl-0 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Privacy Officer:</strong> <a href="mailto:privacy@linus.id.au" className="text-primary underline">privacy@linus.id.au</a></li>
                            <li><strong>General Support:</strong> <a href="mailto:support@linus.id.au" className="text-primary underline">support@linus.id.au</a></li>
                            <li><strong>Data Requests:</strong> <a href="mailto:privacy@linus.id.au" className="text-primary underline">privacy@linus.id.au</a></li>
                            <li><strong>Security Issues:</strong> <a href="mailto:security@linus.id.au" className="text-primary underline">security@linus.id.au</a></li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Business Information:</strong>
                        </p>
                        <ul className="list-none pl-0 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Business Name:</strong> Linus Kang Software</li>
                            <li><strong>Operating As:</strong> Bubbly Maps</li>
                            <li><strong>Location:</strong> Queensland, Australia</li>
                            <li><strong>ABN:</strong> [If applicable - insert Australian Business Number]</li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.2 Response Time:</strong> We aim to respond to all privacy inquiries within 30 days. Complex
                            requests may require additional time, but we will keep you informed of our progress.
                        </p>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.3 Regulatory Authorities:</strong> If you have unresolved concerns, you may contact:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Australian Users:</strong> Office of the Australian Information Commissioner (OAIC) -
                                <a href="https://www.oaic.gov.au" className="text-primary underline">www.oaic.gov.au</a></li>
                            <li><strong>EU/UK Users:</strong> Your local data protection authority</li>
                            <li><strong>US Users:</strong> Federal Trade Commission (FTC) -
                                <a href="https://www.ftc.gov" className="text-primary underline">www.ftc.gov</a></li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">16. Acknowledgment and Consent</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTOOD THIS PRIVACY POLICY, AND YOU
                            CONSENT TO THE COLLECTION, USE, STORAGE, AND SHARING OF YOUR INFORMATION AS DESCRIBED HEREIN.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You further acknowledge that:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>You have had sufficient opportunity to review this Privacy Policy</li>
                            <li>You understand your rights regarding your personal information</li>
                            <li>You understand how to exercise your privacy rights</li>
                            <li>You understand that your contributions to the Service will be public and licensed under CC BY-NC 4.0</li>
                            <li>You have the option to seek independent legal advice if desired</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            By continuing to use the Service, you confirm that you accept this Privacy Policy in full and agree to be bound by its terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">17. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For questions, concerns, or requests regarding this Privacy Policy, please contact us at:
                        </p>

                        <ul className="list-none pl-0 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Privacy Inquiries:</strong> <a href="mailto:privacy@linus.id.au" className="text-primary underline">privacy@linus.id.au</a></li>
                            <li><strong>General Support:</strong> <a href="mailto:support@linus.id.au" className="text-primary underline">support@linus.id.au</a></li>
                            <li><strong>Security Issues:</strong> <a href="mailto:security@linus.id.au" className="text-primary underline">security@linus.id.au</a></li>
                            <li><strong>Legal Notices:</strong> <a href="mailto:legal@linus.id.au" className="text-primary underline">legal@linus.id.au</a></li>
                        </ul>

                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Business Name:</strong> Linus Kang Software<br />
                            <strong>Operating As:</strong> Bubbly Maps<br />
                            <strong>Location:</strong> Queensland, Australia
                        </p>
                    </section>
                    <div className="mt-8 flex justify-center gap-4">
                        <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                            <a href="/terms">Read the Terms of Service</a>
                        </Button>

                    </div>

                </div>
            </div>
        </div>
    )
}