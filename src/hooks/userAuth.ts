import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../supabaseClient'

interface UserData {
  id: string
  username: string
  email: string
  // Agrega aquí cualquier otro campo que necesites de tus usuarios
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener la sesión actual y suscribirse a los cambios
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) throw error
    return data
  }

  const signUp = async (email: string, password: string, username: string) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    })
    if (authError) throw authError

    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({ id: authData.user.id, email, username })
      
      if (profileError) throw profileError
    }

    return authData
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const getCurrentUser = async (): Promise<UserData | null> => {
    if (!user) return null
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('id', user.id)
      .single()
    
    if (error) throw error
    return data
  }

  const getUser = async (userId: string): Promise<UserData | null> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  const getAllUsers = async (): Promise<UserData[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email')
    
    
    if (error) throw error
    return data
  }

  return {
    user,
    session,
    loading,
    signIn,
    signInWithGoogle, // Nuevo método para Google
    signUp,
    signOut,
    getCurrentUser,
    getUser,
    getAllUsers,
  }
}
