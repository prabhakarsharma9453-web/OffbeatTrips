import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { 
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour in seconds
  },
})
