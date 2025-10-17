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
            <div style="font-family: 'Segoe UI', Roboto, sans-serif; background: #000000; padding: 40px 0;">
              <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 32px; border-radius: 0; box-shadow: none;">
                
                <div style="text-align: center; margin-bottom: 24px;">
                  <h1 style="margin: 0; font-size: 26px; color: #000000; font-weight: 400; letter-spacing: -0.5px;">
                    Sign in to <span style="color: #000000; font-weight: 600;">Bubbly</span>
                  </h1>
                </div>
            
                <p style="font-size: 16px; line-height: 1.5; color: #666666; text-align: center; margin: 0 0 32px; font-weight: 400;">
                  Welcome! Click the button below to securely sign in.
                  <br/>
                  <strong style="color: #000000;">This link expires in 10 minutes.</strong>
                </p>
            
                <div style="text-align: center; margin-bottom: 32px;">
                  <a href="${url}" 
                    style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 0; font-weight: 500; font-size: 16px; border: 2px solid #000000; transition: all 0.2s; letter-spacing: 0.5px;">
                    SIGN IN
                  </a>
                </div>

                <p style="font-size: 16px; line-height: 1.5; color: #666666; text-align: center; margin: 0 0 32px; font-weight: 400;">
                  Any questions or concerns? Please reach out at <a href="mailto:email@linus.id.au" style="color: #000000; text-decoration: underline;">email@linus.id.au</a>.
                </p>
            
                <hr style="margin: 0 0 32px; border: none; border-top: 1px solid #e5e5e5;" />
           
                <p style="font-size: 14px; color: #999999; line-height: 1.4; text-align: center; margin: 0; font-weight: 400;">
                  Didn't request this email? You can safely ignore it.<br/>
                  For security reasons, never share this link.
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