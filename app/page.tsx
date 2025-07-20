"use client"

import { useState } from "react"
import { CanvasWorkspace } from "@/components/canvas-workspace"
import { ProtectedRoute } from "@/components/protected-route"
import { useNotes } from "@/hooks/use-notes"

export default function NoteTakingApp() {
  const { notes, loading, createNote, updateNote, deleteNote } = useNotes()
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)

  const handleCreateNote = async () => {
    const newNote = await createNote()
    if (newNote) {
      setCurrentNoteIndex(0) // Switch to the new note
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId)
    if (currentNoteIndex >= notes.length - 1) {
      setCurrentNoteIndex(Math.max(0, notes.length - 2))
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <img src="/dendrita-logo.svg" alt="Dendrita" className="w-8 h-8 animate-pulse" />
            <div className="text-lg font-serif text-gray-600">Cargando notas...</div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <CanvasWorkspace
        notes={notes}
        currentNoteIndex={currentNoteIndex}
        onNoteIndexChange={setCurrentNoteIndex}
        onUpdateNote={updateNote}
        onCreateNote={handleCreateNote}
        onDeleteNote={handleDeleteNote}
      />
    </ProtectedRoute>
  )
}
