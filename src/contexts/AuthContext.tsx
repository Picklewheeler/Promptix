import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export type UserRole = 'executive' | 'systems_admin' | 'it_manager' | 'sales' | '3d_modeler' | 'employee'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  username: string
  role: UserRole
  department: string
  rank: string
  avatar_url?: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  isAdmin: boolean
  hasRole: (roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.email!)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchUserProfile(session.user.email!)
        } else {
          setProfile(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (email: string) => {
    try {
      console.log('Fetching profile for email:', email)
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        throw error
      }
      
      console.log('Profile fetched:', data)
      setProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      // If profile not found, sign out the user
      await supabase.auth.signOut()
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      // First, try to find user in our custom users table to validate credentials
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, password_hash')
        .eq('email', email)
        .single()

      if (userError || !userData) {
        return { error: { message: 'Invalid email or password' } as AuthError }
      }

      // Simple password check (in production, use proper password hashing)
      if (userData.password_hash !== password) {
        return { error: { message: 'Invalid email or password' } as AuthError }
      }

      // If credentials are valid, create a Supabase auth session
      // For demo purposes, we'll use a dummy password for Supabase auth
      // In production, you'd want to migrate to proper Supabase auth or use a different approach
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'demo-password-123' // Using a consistent dummy password for demo
      })

      if (signInError) {
        // If the user doesn't exist in Supabase auth, create them
        const { error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: 'demo-password-123'
        })
        
        if (signUpError) {
          console.error('Sign up error:', signUpError)
          return { error: signUpError }
        }
      }

      return { error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { error: error as AuthError }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const isAdmin = profile?.role === 'executive' || profile?.role === 'systems_admin' || profile?.role === 'it_manager'

  const hasRole = (roles: UserRole[]) => {
    return profile ? roles.includes(profile.role) : false
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    isAdmin,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 