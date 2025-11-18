import NextAuth, { type AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { sendEmail } from "./modules/mail"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }: { session: any; user: any }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.handle = user.handle;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.displayName = user.displayName;
        session.user.bio = user.bio;
        session.user.moderator = user.moderator
        session.user.name = user.name;
      }
      return session;
    },
  },

  events: {
    createUser: async ({ user }: { user: any }) => {
      const emailOptions = {
        to: user.email!,
        subject: "Welcome to Bubbly Maps!",
        html: `<table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color:#111; padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="text-align:left; padding:0 24px;">
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <img src="https://bubblymaps.org/logo.png" alt="Bubbly Maps" width="64" height="64" style="display:block;" />
                  </td>
                </tr>

                <tr>
                  <td style="text-align:center; padding-bottom:12px;">
                    <h2 style="margin:0; font-size:22px; font-weight:600;">Welcome${user.name ? `, ${user.name}` : ""}!</h2>
                  </td>
                </tr>

                <tr>
                  <td style="font-size:16px; line-height:1.7; color:#333; text-align:center; padding-bottom:28px;">
                    <p style="margin:0 0 16px;">Thanks for joining <strong>Bubbly Maps</strong>: the open-source platform with one of the world’s largest public water fountain repository's.</p>
                    <p style="margin:0;">You can explore fountains, add new ones, and help keep water accessible to everyone.</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:24px; background:#f9fafb; border-radius:8px;">
                    <h3 style="margin:0 0 10px; font-size:17px; font-weight:600; color:#111;">How our platform works</h3>
                    <p style="margin:0 0 16px; font-size:15px; line-height:1.6;">Bubbly Maps is a free, open-source project built by contributors around the world.</p>

                    <h4 style="margin:0 0 6px; font-size:16px; color:#111;">Explore Fountains</h4>
                    <p style="margin:0 0 16px; font-size:15px; line-height:1.6;">Discover thousands of public drinking fountains near you, updated by the community in real time.</p>

                    <h4 style="margin:0 0 6px; font-size:16px; color:#111;">Add New Locations</h4>
                    <p style="margin:0; font-size:15px; line-height:1.6;">Found one that’s missing? Add it in seconds — every verified location helps make the map better for everyone.</p>
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:36px 0;">
                    <a href="https://bubblymaps.org" style="background:#2563eb; color:#fff; text-decoration:none; padding:12px 28px; border-radius:6px; font-weight:600; font-size:15px; display:inline-block;">
                      Visit Bubbly Maps
                    </a>
                  </td>
                </tr>

                <tr>
                  <td style="font-size:14px; line-height:1.6; color:#555; text-align:center;">
                    <p style="margin:0 0 10px;">
                      <a href="https://bubblymaps.org/settings" style="color:#2563eb; text-decoration:none;">Account Settings</a> •
                      <a href="https://bubblymaps.org/terms" style="color:#2563eb; text-decoration:none;">Terms</a> •
                      <a href="https://bubblymaps.org/privacy" style="color:#2563eb; text-decoration:none;">Privacy</a>
                    </p>
                  </td>
                </tr>


                <tr>
                  <td style="font-size:13px; color:#888; text-align:center; line-height:1.5; padding-top:px;">
                    <p style="margin:0;">This is an automated message from the Bubbly Maps Team.</p>
                    <p style="margin:0;">Issues or feedback? Reply to this email and our team will get back to you.</p>
                    <p style="margin-top:20px; font-size:13px; color:#999;">– Linus</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        `,
      }
      try {
        await sendEmail(emailOptions);
      } catch (error) {
        console.error("An error occured whilst sending welcome email:", error);
      }
    }
  }
}
export default NextAuth(authOptions)
