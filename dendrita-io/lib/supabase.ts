import { createClient } from "@supabase/supabase-js"

// Update the Supabase configuration with your credentials
const supabaseUrl = "https://cwbakqkcsohzmfiuwfjw.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YmFrcWtjc29oem1maXV3Zmp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMzY3NTgsImV4cCI6MjA2ODYxMjc1OH0.SNXVbYj5UEmLk_7hwhjhCE_QI1D7jZdw8QhiVkrgOBM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface DatabaseNote {
  id: string
  user_id: string
  title: string
  subtitle: string
  content: string
  tags: string[]
  ai_generated_title: string | null
  ai_generated_summary: string | null
  ai_suggested_tags: string[]
  created_at: string
  updated_at: string
}

export interface Tag {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

// Auth helper functions
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

// Profile functions
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  return { data, error }
}

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

  return { data, error }
}

// Notes functions
export const getNotes = async (userId: string) => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  return { data, error }
}

export const createNote = async (userId: string, note: Partial<DatabaseNote>) => {
  const { data, error } = await supabase
    .from("notes")
    .insert([{ ...note, user_id: userId }])
    .select()
    .single()

  return { data, error }
}

export const updateNote = async (noteId: string, updates: Partial<DatabaseNote>) => {
  const { data, error } = await supabase.from("notes").update(updates).eq("id", noteId).select().single()

  return { data, error }
}

export const deleteNote = async (noteId: string) => {
  const { error } = await supabase.from("notes").delete().eq("id", noteId)

  return { error }
}

// Tags functions
export const getTags = async (userId: string) => {
  const { data, error } = await supabase.from("tags").select("*").eq("user_id", userId).order("name")

  return { data, error }
}

export const createTag = async (userId: string, name: string, color = "#6B7280") => {
  const { data, error } = await supabase
    .from("tags")
    .insert([{ user_id: userId, name, color }])
    .select()
    .single()

  return { data, error }
}
