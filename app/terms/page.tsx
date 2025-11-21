import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Footer } from "@/components/footer"
import Header from "@/components/header"

export const metadata = {
  title: "Terms of Service | Bubbly Maps",
  description: "Read the terms and conditions for using Bubbly Maps.",
  openGraph: {
    title: "Terms of Service | Bubbly Maps",
    description: "Read the terms and conditions for using Bubbly Maps.",
    url: "https://bubblymaps.org/terms",
    siteName: "Bubbly Maps",
    type: "website",
  },
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex flex-col items-center gap-6 mb-12">
                    <h1 className="text-4xl font-bold text-center">Terms of Service</h1>
                    <p className="text-muted-foreground text-center">
                        Last updated: November 16, 2025
                    </p>
                </div>

                <div className="mb-4 p-4 border rounded-lg bg-green-100 dark:bg-green-900">
                    <h3 className="text-xl font-semibold mb-2 text-green-900 dark:text-green-100">Effective Date</h3>
                    <p className="text-green-900 dark:text-green-100">
                        These Terms and Conditions are effective as of November 16, 2025.
                    </p>
                </div>

                <div className="mb-8 p-4 border rounded-lg bg-muted/10 dark:bg-muted/20">
                    <h3 className="text-xl font-semibold mb-2">Summary of Terms:</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-1 text-sm">
                        <li>Bubbly Maps is a free public service with no warranty or guarantee of availability</li>
                        <li>Users must be 13+ years old; users under 18 need parental consent</li>
                        <li>All user content is licensed under CC BY-NC 4.0 and must be accurate and truthful</li>
                        <li>Vandalism, spam, fraudulent submissions, and abuse will result in immediate termination</li>
                        <li>Commercial use, automated scraping, and API abuse are strictly prohibited</li>
                        <li>You grant Bubbly perpetual rights to use, modify, and display your contributions</li>
                        <li>Service may be modified, suspended, or terminated at any time without notice</li>
                        <li>Users are liable for their own submissions and must not violate others' rights</li>
                        <li>Bubbly has no liability for damages, injuries, or losses arising from Service use</li>
                        <li>All disputes are governed by Queensland, Australian law</li>
                    </ul>
                    <p className="text-muted-foreground mt-4 text-sm">
                        For full details, please read the sections below and the Privacy Policy.
                    </p>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            Welcome to Bubbly Maps ("Bubbly," "we," "our," or "us"). By accessing or using Bubbly Maps (the "Service"),
                            including the mobile app, website, API, and any related services, you agree to be bound by these Terms of
                            Service ("Terms"). If you do not agree to these Terms, you must immediately cease use of the Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            These Terms constitute a legally binding agreement between you and Bubbly Maps. Your continued use of the
                            Service constitutes acceptance of any modifications to these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Eligibility and Age Requirements</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>2.1 Minimum Age:</strong> You must be at least 13 years old to use the Service. Users under 18
                            years of age must have permission from a parent or legal guardian to use the Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>2.2 Capacity:</strong> By using the Service, you represent and warrant that you have the legal
                            capacity to enter into these Terms and to abide by all provisions herein.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>2.3 Jurisdictional Compliance:</strong> You are responsible for ensuring your use of the Service
                            complies with all applicable local, state, national, and international laws and regulations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Service Description and Availability</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>3.1 Nature of Service:</strong> Bubbly Maps is a free, community-driven public service providing
                            a database and mapping platform for publicly accessible water fountains worldwide. The Service is provided
                            "as is" without any warranties or guarantees.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>3.2 No Guarantee of Availability:</strong> We reserve the right to modify, suspend, or discontinue
                            the Service (or any part thereof) at any time, with or without notice, for any reason, including but not
                            limited to maintenance, technical issues, or financial constraints.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>3.3 Service Modifications:</strong> We may change features, functionality, or content of the
                            Service at our sole discretion. We are not obligated to provide any specific features or maintain any
                            particular functionality.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>3.4 Data Accuracy:</strong> While we strive for accuracy, we do not guarantee that all water
                            fountain locations, conditions, or information are current, accurate, or complete. Users should verify
                            information independently before relying on it.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. User Accounts and Security</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>4.1 Account Creation:</strong> When you create an account, you must provide accurate, complete,
                            and current information. Providing false information constitutes a breach of these Terms.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>4.2 Account Security:</strong> You are solely responsible for maintaining the confidentiality of
                            your account credentials and for all activities that occur under your account. You must immediately notify
                            us of any unauthorized use of your account.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>4.3 Account Restrictions:</strong> You may not:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Create multiple accounts to evade restrictions or bans</li>
                            <li>Share your account with others or allow others to access your account</li>
                            <li>Create accounts using automated means or false information</li>
                            <li>Impersonate any person, organization, or entity</li>
                            <li>Purchase, sell, rent, or transfer your account</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. User Content and Submissions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>5.1 Content Standards:</strong> All user-submitted content, including water fountain locations,
                            reviews, photos, ratings, descriptions, and edits must be:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Accurate and truthful to the best of your knowledge</li>
                            <li>Based on actual personal experience or direct observation</li>
                            <li>Respectful, appropriate, and lawful</li>
                            <li>Free from spam, advertising, or promotional content</li>
                            <li>Original or properly licensed content that does not infringe third-party rights</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>5.2 License Grant:</strong> By submitting content to Bubbly Maps, you grant us a perpetual,
                            irrevocable, worldwide, non-exclusive, royalty-free, sublicensable, and transferable license to use,
                            reproduce, distribute, prepare derivative works of, display, perform, and otherwise exploit your content
                            in connection with the Service and our business operations. All user content is licensed under Creative
                            Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>5.3 Content Ownership:</strong> You retain ownership of your submitted content, but you acknowledge
                            that Bubbly and other users may use your content under the CC BY-NC 4.0 license terms.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>5.4 Content Removal:</strong> We reserve the right to remove, edit, or refuse to publish any
                            content at our sole discretion, with or without notice, for any reason or no reason.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>5.5 Representations and Warranties:</strong> By submitting content, you represent and warrant that:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>You own or have the necessary rights to submit the content</li>
                            <li>The content does not violate any third-party rights</li>
                            <li>The content is accurate and not misleading</li>
                            <li>The content complies with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Prohibited Conduct</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree not to engage in any of the following prohibited activities:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li><strong>Fraudulent Submissions:</strong> Creating fake water fountain locations, false reviews, or
                                misleading information intended to deceive other users</li>
                            <li><strong>Vandalism:</strong> Deliberately corrupting, defacing, or destroying legitimate data or content</li>
                            <li><strong>Spam and Abuse:</strong> Posting repetitive, irrelevant, or unsolicited content, or using the
                                Service for commercial advertising without authorization</li>
                            <li><strong>Harassment:</strong> Harassing, threatening, intimidating, or abusing other users</li>
                            <li><strong>Offensive Content:</strong> Posting content that is obscene, pornographic, hateful,
                                discriminatory, defamatory, or otherwise objectionable</li>
                            <li><strong>Illegal Activity:</strong> Using the Service to facilitate, promote, or engage in any illegal
                                activity</li>
                            <li><strong>Copyright Infringement:</strong> Uploading photos or content that you do not have rights to use</li>
                            <li><strong>System Interference:</strong> Attempting to interfere with, disrupt, or compromise the
                                integrity, security, or proper functioning of the Service</li>
                            <li><strong>Unauthorized Access:</strong> Attempting to gain unauthorized access to any accounts, systems,
                                or networks associated with the Service</li>
                            <li><strong>Reverse Engineering:</strong> Attempting to decompile, disassemble, reverse engineer, or
                                otherwise derive source code from the Service</li>
                            <li><strong>Automated Access:</strong> Using bots, scrapers, crawlers, or other automated means to access
                                the Service without express written permission</li>
                            <li><strong>Data Mining:</strong> Systematically extracting data from the Service for commercial purposes
                                or to create competing services</li>
                            <li><strong>Load Testing:</strong> Conducting stress tests or deliberately overloading our systems</li>
                            <li><strong>Circumvention:</strong> Attempting to bypass any security measures, rate limits, or
                                access controls</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Commercial Use and API Restrictions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.1 Non-Commercial Use:</strong> The Service is intended for personal, non-commercial use only.
                            Any commercial use requires prior written authorization from Bubbly Maps.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.2 API Access:</strong> If you are granted API access, you agree to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Comply with all rate limits and usage restrictions</li>
                            <li>Not use the API to create competing services or products</li>
                            <li>Properly attribute Bubbly Maps as the data source</li>
                            <li>Not cache or store data beyond reasonable limits</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.3 Data Scraping:</strong> Unauthorized automated scraping, crawling, or bulk downloading of
                            data from the Service is strictly prohibited and may result in legal action, account termination, and
                            IP blocking.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>7.4 Commercial Inquiries:</strong> For commercial licensing or partnership opportunities, contact
                            us at support@linus.id.au.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property Rights</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>8.1 Bubbly Maps Property:</strong> The Service, including its software, design, logos, trademarks,
                            user interface, graphics, and underlying technology, are the exclusive property of Linus Kang and Linus
                            Kang Software. These materials are protected by copyright, trademark, and other intellectual property laws
                            of Australia and international treaties.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>8.2 Open Source License:</strong> The Bubbly Maps application code is licensed under Creative
                            Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0). This license permits personal,
                            non-commercial use with proper attribution.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>8.3 Restrictions:</strong> You may not:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Remove, alter, or obscure any copyright, trademark, or proprietary notices</li>
                            <li>Use Bubbly Maps trademarks, logos, or branding without written permission</li>
                            <li>Create derivative works for commercial purposes</li>
                            <li>Claim ownership of Bubbly Maps intellectual property</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>8.4 DMCA and Copyright Infringement:</strong> We respect intellectual property rights. If you
                            believe content on the Service infringes your copyright, contact us at ip@linus.id.au with:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Identification of the copyrighted work</li>
                            <li>Location of the infringing material</li>
                            <li>Your contact information</li>
                            <li>A statement of good faith belief that use is unauthorized</li>
                            <li>A statement that the information is accurate and you are authorized to act</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Privacy and Data Collection</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>9.1 Privacy Policy:</strong> Your use of the Service is governed by our Privacy Policy, which
                            explains how we collect, use, store, and protect your personal information. By using the Service, you
                            consent to our data practices as described in the Privacy Policy.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>9.2 User Responsibility:</strong> You are responsible for ensuring that any personal information
                            you submit does not violate the privacy rights of others. Do not post personal information about other
                            individuals without their consent.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Account Termination and Suspension</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.1 Termination Rights:</strong> We reserve the right to suspend, terminate, or restrict your
                            access to the Service immediately, without prior notice or liability, for any reason, including but not
                            limited to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Violation of these Terms or the Privacy Policy</li>
                            <li>Fraudulent, abusive, or illegal activity</li>
                            <li>Submitting false or misleading information</li>
                            <li>Harassing other users or staff</li>
                            <li>Attempting to compromise Service security or integrity</li>
                            <li>Using automated tools without authorization</li>
                            <li>Any conduct we deem harmful to the Service or community</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.2 Effect of Termination:</strong> Upon termination, your right to use the Service immediately
                            ceases. We may delete your account and all associated data. We are not obligated to retain or provide
                            copies of your content after termination.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.3 Appeals:</strong> If your account is terminated, you may appeal by contacting
                            support@linus.id.au within 30 days. Appeals are reviewed at our sole discretion, and our decision is final.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>10.4 Survival:</strong> Sections of these Terms that by their nature should survive termination
                            will remain in effect, including intellectual property provisions, disclaimers, limitations of liability,
                            and indemnification obligations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Disclaimers and Warranties</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.1 "AS IS" Service:</strong> THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS
                            WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES
                            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, OR COURSE OF PERFORMANCE.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.2 No Warranty of Accuracy:</strong> We do not warrant that:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>The Service will be uninterrupted, secure, or error-free</li>
                            <li>Water fountain locations or information are accurate, complete, or current</li>
                            <li>Water fountains are functional, safe, or suitable for any purpose</li>
                            <li>Defects will be corrected</li>
                            <li>The Service is free from viruses or harmful components</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.3 User Responsibility:</strong> You acknowledge that you use the Service at your own risk.
                            You are solely responsible for verifying the accuracy and safety of water fountain locations before use.
                            We recommend exercising caution and common sense when using water fountains.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.4 Third-Party Content:</strong> The Service may contain links to third-party websites or
                            services. We are not responsible for and do not endorse third-party content, and your use of third-party
                            services is at your own risk.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>11.5 No Professional Advice:</strong> Information provided through the Service is for informational
                            purposes only and does not constitute professional, health, or safety advice.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.1 Maximum Liability:</strong> TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT SHALL BUBBLY
                            MAPS, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, AFFILIATES, OR LINUS KANG OR LINUS KANG
                            SOFTWARE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES,
                            INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Loss of profits, revenue, data, or business opportunities</li>
                            <li>Personal injury or property damage</li>
                            <li>Illness from contaminated water sources</li>
                            <li>Damages arising from reliance on inaccurate information</li>
                            <li>Service interruptions or data loss</li>
                            <li>Unauthorized access to or alteration of your transmissions or data</li>
                            <li>Statements or conduct of any third party on the Service</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.2 Total Liability Cap:</strong> Our total liability to you for all claims arising from or
                            related to the Service shall not exceed AUD $100 or the amount you paid us in the past 12 months,
                            whichever is greater.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>12.3 Basis of the Bargain:</strong> You acknowledge that we have offered the Service, set our
                            prices, and entered into these Terms in reliance upon the disclaimers and limitations of liability set
                            forth herein, which reflect a reasonable and fair allocation of risk and form an essential basis of the
                            bargain between us.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">13. Indemnification</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You agree to indemnify, defend, and hold harmless Bubbly Maps, Linus Kang, Linus Kang Software, and
                            their respective directors, officers, employees, agents, affiliates, and partners from and against any
                            and all claims, liabilities, damages, losses, costs, expenses, or fees (including reasonable attorneys'
                            fees) arising from:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Your use or misuse of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights, including intellectual property or privacy rights</li>
                            <li>Your content or submissions</li>
                            <li>Your negligent or wrongful conduct</li>
                            <li>Any false or misleading information you provide</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            This indemnification obligation survives termination of these Terms and your use of the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">14. Governing Law and Dispute Resolution</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.1 Governing Law:</strong> These Terms and any dispute arising out of or related to them or
                            the Service shall be governed by and construed in accordance with the laws of Queensland, Australia,
                            without regard to conflict of law principles.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.2 Jurisdiction:</strong> You irrevocably submit to the exclusive jurisdiction of the courts
                            of Queensland, Australia for the resolution of any disputes arising from these Terms or the Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>14.3 Waiver of Class Actions:</strong> To the extent permitted by law, you agree that any dispute
                            resolution proceedings will be conducted only on an individual basis and not in a class, consolidated,
                            or representative action.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">15. Modifications to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.1 Right to Modify:</strong> We reserve the right to modify, amend, or replace these Terms at
                            any time at our sole discretion. We will make reasonable efforts to notify users of material changes by:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Posting a notice on the Service</li>
                            <li>Sending an email to your registered email address</li>
                            <li>Updating the "Last Updated" date at the top of these Terms</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.2 Material Changes:</strong> For material changes, we will provide at least 30 days' notice
                            before the new Terms take effect. What constitutes a material change is determined at our sole discretion.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>15.3 Acceptance:</strong> Your continued use of the Service after any modifications indicates
                            your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using
                            the Service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">16. General Provisions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.1 Entire Agreement:</strong> These Terms, together with the Privacy Policy, constitute the
                            entire agreement between you and Bubbly Maps regarding the Service and supersede all prior agreements
                            and understandings.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.2 Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable,
                            that provision shall be modified to the minimum extent necessary to make it valid and enforceable, or if
                            that is not possible, severed from these Terms. The remaining provisions shall remain in full force and effect.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.3 Waiver:</strong> No waiver of any term or condition shall be deemed a further or continuing
                            waiver of such term or any other term. Our failure to enforce any right or provision shall not constitute
                            a waiver of that right or provision.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.4 Assignment:</strong> You may not assign or transfer these Terms or your rights hereunder
                            without our prior written consent. We may assign these Terms without restriction.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.5 Force Majeure:</strong> We shall not be liable for any failure or delay in performance
                            due to circumstances beyond our reasonable control, including acts of God, natural disasters, war,
                            terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, pandemics,
                            strikes, or shortages of transportation, facilities, fuel, energy, labor, or materials.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.6 No Third-Party Beneficiaries:</strong> These Terms do not and are not intended to confer
                            any rights or remedies upon any person other than you and Bubbly Maps.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>16.7 Headings:</strong> Section headings are for convenience only and shall not affect the
                            interpretation of these Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">17. Security and Responsible Disclosure</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>17.1 Security Vulnerabilities:</strong> If you discover a security vulnerability or weakness
                            in the Service, you must report it responsibly to security@linus.id.au. You agree not to:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Exploit the vulnerability for malicious purposes</li>
                            <li>Publicly disclose the vulnerability before we have had reasonable time to address it</li>
                            <li>Access or modify data that does not belong to you</li>
                            <li>Perform testing that degrades Service performance or availability</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>17.2 Bug Bounty:</strong> We appreciate responsible security researchers and may offer
                            recognition or rewards at our discretion for valid security reports.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">18. Reporting Violations and Abuse</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>18.1 Community Reporting:</strong> Users are encouraged to report violations of these Terms,
                            including:
                        </p>
                        <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
                            <li>Fake or fraudulent water fountain submissions</li>
                            <li>Abusive, offensive, or inappropriate content</li>
                            <li>Spam or commercial solicitations</li>
                            <li>Vandalism or deliberate data corruption</li>
                            <li>Copyright infringement</li>
                            <li>Privacy violations</li>
                            <li>Harassment or threatening behavior</li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>18.2 Contact Information:</strong> Report violations to support@linus.id.au with detailed
                            information about the issue.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>18.3 False Reports:</strong> Submitting false or malicious reports may result in account
                            termination.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">19. Data Retention and Deletion</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>19.1 Retention Period:</strong> We retain your data as described in our Privacy Policy. We
                            may retain certain information even after account deletion for legal, operational, or safety reasons.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>19.2 Content Persistence:</strong> Content you submit (water fountain locations, reviews,
                            photos) may remain on the Service even after account deletion, as it becomes part of the community
                            database. However, such content will be anonymized where possible.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>19.3 Data Requests:</strong> You may request deletion of your personal data by contacting
                            support@linus.id.au. We will comply with applicable data protection laws, but some data may be
                            retained as permitted or required by law.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">20. International Use and Export Compliance</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>20.1 International Access:</strong> The Service is controlled and operated from Australia.
                            We make no representation that the Service is appropriate or available for use in other locations.
                            If you access the Service from outside Australia, you do so at your own risk and are responsible for
                            compliance with local laws.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>20.2 Export Controls:</strong> You agree to comply with all applicable export and import
                            control laws and regulations.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">21. Volunteer and Community Contributions</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>21.1 Volunteer Nature:</strong> Bubbly Maps is powered by community contributions. All users
                            contribute on a voluntary basis. There is no employment, contractor, or agency relationship between
                            contributors and Bubbly Maps.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>21.2 No Compensation:</strong> Contributors are not entitled to compensation for submissions,
                            edits, or contributions. All contributions are made freely and voluntarily.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>21.3 Community Standards:</strong> We expect all contributors to act in good faith, collaborate
                            respectfully, and prioritize accuracy and helpfulness to the community.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">22. Service Costs and Free Access</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>22.1 Free Service:</strong> Bubbly Maps is currently provided free of charge as a public
                            service. However, we reserve the right to introduce fees, subscriptions, or premium features at any
                            time with reasonable notice.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>22.2 Donations:</strong> If we accept donations, they are voluntary and non-refundable.
                            Donations do not entitle donors to any special rights, features, or influence over the Service.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>22.3 Advertising:</strong> We reserve the right to display advertisements or sponsored content
                            on the Service. You agree that we may place such content without compensation to you.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">23. Accessibility</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            While we strive to make the Service accessible to users with disabilities, we make no guarantees about
                            accessibility compliance. If you encounter accessibility issues, please contact support@linus.id.au.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">24. Contact Information</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            For questions, concerns, or notices regarding these Terms, please contact us at:
                        </p>
                        <ul className="list-none pl-0 text-muted-foreground space-y-2 mb-4">
                            <li><strong>General Support:</strong> <a href="mailto:support@linus.id.au" className="text-primary underline">support@linus.id.au</a></li>
                            <li><strong>Security Issues:</strong> <a href="mailto:security@linus.id.au" className="text-primary underline">security@linus.id.au</a></li>
                            <li><strong>Intellectual Property:</strong> <a href="mailto:ip@linus.id.au" className="text-primary underline">ip@linus.id.au</a></li>
                            <li><strong>Legal Notices:</strong> <a href="mailto:legal@linus.id.au" className="text-primary underline">legal@linus.id.au</a></li>
                        </ul>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            <strong>Business Name:</strong> Linus Kang Software<br />
                            <strong>Location:</strong> Queensland, Australia
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">25. Acknowledgment</h2>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND
                            AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SERVICE.
                        </p>
                        <p className="text-muted-foreground leading-relaxed mb-4">
                            You further acknowledge that these Terms constitute a binding legal agreement between you and Bubbly
                            Maps, and that you have had sufficient opportunity to review these Terms and seek independent legal
                            advice if desired.
                        </p>
                    </section>
                </div>

                <div className="mt-12 p-6 border rounded-lg bg-muted/10 dark:bg-muted/20">
                    <h3 className="text-xl font-semibold mb-4 text-center">Important Reminders</h3>
                    <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                        <li>Always verify water fountain information before use</li>
                        <li>Report inaccuracies, vandalism, or abuse immediately</li>
                        <li>Contribute accurate, honest information to help the community</li>
                        <li>Respect other users and the volunteer nature of this service</li>
                        <li>Use the Service responsibly and in accordance with these Terms</li>
                    </ul>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Button variant="outline" className="cursor-pointer bg-transparent" asChild>
                        <a href="/privacy">Read the Privacy Policy</a>
                    </Button>

                </div>

                <Footer />
            </div>
        </div>
    )
}