import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import EmailProvider from "next-auth/providers/email"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY!)

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { scope: "openid email profile" },
      },
    }),

    EmailProvider({
      async sendVerificationRequest({ identifier: email, url }) {
        await resend.emails.send({
          from: "Bubbly Maps <hello@bubblymaps.org>",
          to: email,
          subject: "Your account sign-in link",
          html: `
            <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #000; padding: 40px 0;">
              <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 40px 48px; border-radius: 0; border: 1px solid #e5e5e5;">
                
                <div style="text-align: center; margin-bottom: 32px;">
                  <h1 style="margin: 0; font-size: 28px; color: #000; font-weight: 500; letter-spacing: -0.5px;">
                    Sign in to <span style="font-weight: 700;">Bubbly Maps</span>
                  </h1>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #333; text-align: center; margin: 0 0 36px;">
                  Click the button below to securely sign in.<br/>
                  <strong style="color: #000;">This link expires in 10 minutes.</strong>
                </p>

                <div style="text-align: center; margin-bottom: 40px;">
                  <a href="${url}" 
                    style="display: inline-block; background-color: #000; color: #fff; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 15px; letter-spacing: 0.3px; border: 1px solid #000;">
                    Sign in
                  </a>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #333; text-align: center; margin: 0 0 36px;">
                  Questions or issues? Contact 
                  <a href="mailto:support@bubblymaps.org" style="color: #000; text-decoration: underline;">support@bubblymaps.org</a>.
                </p>

                <hr style="margin: 0 0 32px; border: none; border-top: 1px solid #e5e5e5;" />

                <p style="font-size: 13px; color: #777; line-height: 1.6; text-align: center; margin: 0;">
                  Didn’t request this email? You can safely ignore it.<br/>
                  Never share this link with anyone.
                </p>
              </div>
            </div>
          `,
        })
      },
      maxAge: 10 * 60, // 10 minutes
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.handle = user.handle;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.displayName = user.displayName;
        session.user.bio = user.bio;
        session.user.moderator = user.moderator
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
}