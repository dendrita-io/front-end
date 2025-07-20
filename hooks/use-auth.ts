"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type Profile, getProfile } from "@/lib/supabase"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true) // Start as true

  useEffect(() => {
    // onAuthStateChange fires immediately with the current session,
    // providing a single source of truth.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        // Fetch profile only if a user session exists.
        const { data: profileData, error } = await getProfile(currentUser.id)
        if (error) {
          console.error("Error fetching profile:", error)
          setProfile(null)
        } else {
          setProfile(profileData)
        }
      } else {
        // Clear profile if there is no user.
        setProfile(null)
      }

      // The auth check is complete, so we are no longer loading.
      setLoading(false)
    })

    // Cleanup subscription on component unmount.
    return () => {
      subscription.unsubscribe()
    }
  }, []) // The empty dependency array ensures this effect runs only once.

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  }
}
