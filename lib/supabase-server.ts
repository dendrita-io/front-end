import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createClient = () => {
  const cookieStore = cookies()

  return createServerClient(
    "https://cwbakqkcsohzmfiuwfjw.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YmFrcWtjc29oem1maXV3Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzY3NTgsImV4cCI6MjA2ODYxMjc1OH0.SNXVbYj5UEmLk_7hwhjhCE_QI1D7jZdw8QhiVkrgOBM",
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  )
}
