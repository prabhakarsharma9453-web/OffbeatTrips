import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

// Lazy load MongoDB to avoid Edge Runtime issues
const getMongoDB = async () => {
  if (typeof window !== 'undefined') return null
  // @ts-ignore - EdgeRuntime is available in Edge Runtime
  if (typeof EdgeRuntime !== 'undefined' || process.env.NEXT_RUNTIME === 'edge') return null
  
  try {
    const { default: connectDB } = await import('@/lib/mongodb')
    const { default: User } = await import('@/models/User')
    const bcrypt = await import('bcryptjs')
    return { connectDB, User, bcrypt: bcrypt.default }
  } catch (error) {
    console.error('Failed to load MongoDB:', error)
    return null
  }
}

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        try {
          const mongo = await getMongoDB()
          if (!mongo) return null

          await mongo.connectDB()

          const user = await mongo.User.findOne({
            $or: [
              { username: credentials.username as string },
              { email: credentials.username as string },
            ],
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await mongo.bcrypt.compare(
            credentials.password as string,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email || user.username,
            name: user.name || user.username,
            role: user.role,
          }
        } catch (error) {
          console.error("Error in credentials authorize:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const mongo = await getMongoDB()
          if (mongo) {
            await mongo.connectDB()

            const existingUser = await mongo.User.findOne({ email: user.email })

            if (!existingUser) {
              await mongo.User.create({
                email: user.email,
                name: user.name || null,
                image: user.image || null,
                role: "user",
              })
            } else {
              await mongo.User.findByIdAndUpdate(existingUser._id, {
                name: user.name || existingUser.name,
                image: user.image || existingUser.image,
              })
            }
          }
        } catch (error) {
          console.error("Error in signIn callback:", error)
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if (user.role) {
          token.role = user.role
        } else {
          try {
            const mongo = await getMongoDB()
            if (mongo) {
              await mongo.connectDB()
              const userData = await mongo.User.findById(user.id).lean()
              token.role = userData?.role || "user"
            } else {
              token.role = "user"
            }
          } catch (error) {
            console.error("Error fetching user role:", error)
            token.role = "user"
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
} satisfies NextAuthConfig
