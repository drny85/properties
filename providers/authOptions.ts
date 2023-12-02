import { firebaseAuth } from '@/providers/firestore'
import { sendVerificationRequest } from '@/utils//sendVerificationToken'
import { FirestoreAdapter } from '@auth/firebase-adapter'
import type { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { app, auth } from '@/firebase'
import { User } from 'next-auth'

export const authOptions: AuthOptions = {
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
         authorization: {
            params: {
               prompt: 'consent',
               access_type: 'offline',
               response_type: 'code',
            },
         },
      }),
      //@ts-ignore
      {
         id: 'resend',
         type: 'email',
         name: 'Email',
         sendVerificationRequest,
      },
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            email: { label: 'Email', type: 'text' },
            password: { label: 'Password', type: 'password' },
         },
         async authorize(credentials): Promise<User | null> {
            if (!credentials || !credentials.email || !credentials.password)
               return null
            const { user } = await signInWithEmailAndPassword(
               auth,
               credentials?.email!,
               credentials?.password!
            )
            if (user) {
               return {
                  id: user.uid,
                  ...user,
               }
            } else {
               return null
            }
         },
      }),
   ],
   callbacks: {
      async session({ session, token }) {
         if (session?.user) {
            if (token.sub) {
               session.user.id = token.sub
               const fbToken = await firebaseAuth.createCustomToken(token.sub)
               session.firebaseToken = fbToken
            }
         }
         return session
      },

      jwt: async ({ token, user }) => {
         if (user) {
            token.id = user.id
         }
         return token
      },
   },
   adapter: FirestoreAdapter(app),
   session: {
      strategy: 'jwt',
   },
}
