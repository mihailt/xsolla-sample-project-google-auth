import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'


export const XsollaAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // ** 30 days
  },

  callbacks: {
    async jwt({ token, user }) {

      if (user) {
        const u = await prisma.user.findFirst({
          where: {
            email: user.email
          }
        })

        token.id = user.id
        token.email = user.email
      }

      return token
    },
    async session({ session, token }) {

      if (session.user) {
        const u = await prisma.user.findFirst({
          where: {
            email: token.email
          }
        })

        session.user.id = token.id
        session.user.email = token.email
      }

      return session
    }
  }
}
