import NextAuth, { NextAuthOptions } from 'next-auth'
import { XsollaAuthOptions } from '@/lib/auth'

const handler = NextAuth(XsollaAuthOptions)
export {handler as GET, handler as POST}