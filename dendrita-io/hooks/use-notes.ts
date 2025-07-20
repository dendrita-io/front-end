"use client"

import { useState, useEffect } from "react"
import { useAuthContext } from "@/components/auth-provider"
import {
  getNotes,
  createNote,
  updateNote as updateNoteDB,
  deleteNote as deleteNoteDB,
  type DatabaseNote,
} from "@/lib/supabase"
import type { Note } from "@/types/note"

// Convert database note to app note format
const convertDatabaseNote = (dbNote: DatabaseNote): Note => ({
  id: dbNote.id,
  title: dbNote.title,
  subtitle: dbNote.subtitle,
  content: dbNote.content,
  tags: dbNote.tags,
  createdAt: new Date(dbNote.created_at),
  updatedAt: new Date(dbNote.updated_at),
  aiGenerated:
    dbNote.ai_generated_title || dbNote.ai_generated_summary || dbNote.ai_suggested_tags.length > 0
      ? {
          title: dbNote.ai_generated_title || dbNote.title,
          summary: dbNote.ai_generated_summary || dbNote.subtitle,
          suggestedTags: dbNote.ai_suggested_tags,
        }
      : undefined,
})

// Convert app note to database format
const convertToDatabase = (note: Partial<Note>): Partial<DatabaseNote> => ({
  title: note.title,
  subtitle: note.subtitle,
  content: note.content,
  tags: note.tags,
  ai_generated_title: note.aiGenerated?.title,
  ai_generated_summary: note.aiGenerated?.summary,
  ai_suggested_tags: note.aiGenerated?.suggestedTags || [],
})

export function useNotes() {
  const { user, isAuthenticated } = useAuthContext()
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  // Load notes when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadNotes()
    } else {
      setNotes([])
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const loadNotes = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await getNotes(user.id)
      if (error) {
        console.error("Error loading notes:", error)
      } else if (data) {
        const convertedNotes = data.map(convertDatabaseNote)
        setNotes(convertedNotes)
      }
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setLoading(false)
    }
  }

  const createNewNote = async (): Promise<Note | null> => {
    if (!user) return null

    try {
      const newNoteData = {
        title: "Nueva nota",
        subtitle: "Breve resumen del contenido de la nota",
        content: "",
        tags: ["Label"],
      }

      const { data, error } = await createNote(user.id, newNoteData)
      if (error) {
        console.error("Error creating note:", error)
        return null
      }

      if (data) {
        const newNote = convertDatabaseNote(data)
        setNotes((prev) => [newNote, ...prev])
        return newNote
      }
    } catch (error) {
      console.error("Error creating note:", error)
    }
    return null
  }

  const updateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      const dbUpdates = convertToDatabase(updates)
      const { data, error } = await updateNoteDB(noteId, dbUpdates)

      if (error) {
        console.error("Error updating note:", error)
        return
      }

      if (data) {
        const updatedNote = convertDatabaseNote(data)
        setNotes((prev) => prev.map((note) => (note.id === noteId ? updatedNote : note)))
      }
    } catch (error) {
      console.error("Error updating note:", error)
    }
  }

  const deleteNote = async (noteId: string) => {
    try {
      const { error } = await deleteNoteDB(noteId)
      if (error) {
        console.error("Error deleting note:", error)
        return
      }

      setNotes((prev) => prev.filter((note) => note.id !== noteId))
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  return {
    notes,
    loading,
    createNote: createNewNote,
    updateNote,
    deleteNote,
    refreshNotes: loadNotes,
  }
}
