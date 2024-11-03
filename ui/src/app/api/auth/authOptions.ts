import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { login, LoginResponse } from '@/app/api/api'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                identifier: { label: "Username or Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.identifier || !credentials?.password) {
                    throw new Error('Username/Email and password are required')
                }

                try {
                    const response: LoginResponse = await login(credentials.identifier, credentials.password)
                    if (response.access_token) {
                        return {
                            id: response.id.toString(),
                            email: response.email,
                            name: response.username, // Using username as name
                            accessToken: response.access_token
                        }
                    } else {
                        return null
                    }
                } catch (error) {
                    console.error('Authentication error:', error)
                    return null
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken
                token.username = user.name // Store username in token
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string
                session.user.username = token.username as string // Add username to session
            }
            session.accessToken = token.accessToken as string
            return session
        },
    },
    pages: {
        signIn: '/login',
    },
    debug: process.env.NODE_ENV === 'development',
}