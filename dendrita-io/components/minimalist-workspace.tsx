"use client"

import { useState } from "react"
import { TopMenuBar } from "@/components/top-menu-bar"
import { NoteContent } from "@/components/note-content"
import { PaginationControls } from "@/components/pagination-controls"
import { AiAssistantPanel } from "@/components/ai-assistant-panel"
import type { Note } from "@/types/note"

interface MinimalistWorkspaceProps {
  notes: Note[]
  currentNoteIndex: number
  onNoteIndexChange: (index: number) => void
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
}

export function MinimalistWorkspace({
  notes,
  currentNoteIndex,
  onNoteIndexChange,
  onUpdateNote,
  onCreateNote,
  onDeleteNote,
}: MinimalistWorkspaceProps) {
  const [aiPanelOpen, setAiPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const currentNote = notes[currentNoteIndex]
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const navigateToNote = (direction: "prev" | "next") => {
    if (direction === "prev" && currentNoteIndex > 0) {
      onNoteIndexChange(currentNoteIndex - 1)
    } else if (direction === "next" && currentNoteIndex < notes.length - 1) {
      onNoteIndexChange(currentNoteIndex + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopMenuBar
        notes={notes}
        currentNote={currentNote}
        onCreateNote={onCreateNote}
        onDeleteNote={onDeleteNote}
        onToggleAi={() => setAiPanelOpen(!aiPanelOpen)}
        aiPanelOpen={aiPanelOpen}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filteredNotes={filteredNotes}
        onNoteSelect={(noteId) => {
          const index = notes.findIndex((note) => note.id === noteId)
          if (index !== -1) onNoteIndexChange(index)
        }}
      />

      <main className="relative">
        <div className={`transition-all duration-300 ${aiPanelOpen ? "mr-96" : "mr-0"}`}>
          {currentNote ? (
            <>
              <NoteContent
                note={currentNote}
                onUpdate={(updates) => onUpdateNote(currentNote.id, updates)}
                allNotes={notes}
              />

              <PaginationControls
                currentIndex={currentNoteIndex}
                totalNotes={notes.length}
                onNavigate={navigateToNote}
                currentNote={currentNote}
              />
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">No hay notas disponibles</p>
                <button
                  onClick={onCreateNote}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Crear primera nota
                </button>
              </div>
            </div>
          )}
        </div>

        <AiAssistantPanel isOpen={aiPanelOpen} onClose={() => setAiPanelOpen(false)} currentNote={currentNote} />
      </main>
    </div>
  )
}
