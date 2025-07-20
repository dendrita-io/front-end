"use client"

import { useState } from "react"
import { NoteSidebar } from "@/components/note-sidebar"
import { CanvasEditor } from "@/components/canvas-editor"
import { AiAssistantSidebar } from "@/components/ai-assistant-sidebar"
import { PersistentMenu } from "@/components/persistent-menu"
import type { Note } from "@/types/note"

interface CanvasWorkspaceProps {
  notes: Note[]
  currentNoteIndex: number
  onNoteIndexChange: (index: number) => void
  onUpdateNote: (noteId: string, updates: Partial<Note>) => void
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
}

export function CanvasWorkspace({
  notes,
  currentNoteIndex,
  onNoteIndexChange,
  onUpdateNote,
  onCreateNote,
  onDeleteNote,
}: CanvasWorkspaceProps) {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)
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

  const allExistingTags = Array.from(new Set(notes.flatMap((note) => note.tags))).filter((tag) => tag.length > 0)

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Left Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          leftSidebarOpen ? "w-80" : "w-0"
        } flex-shrink-0 overflow-hidden`}
      >
        <NoteSidebar
          notes={filteredNotes}
          activeNoteId={currentNote?.id}
          onNoteSelect={(noteId) => {
            const index = notes.findIndex((note) => note.id === noteId)
            if (index !== -1) onNoteIndexChange(index)
          }}
          onNewNote={onCreateNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onToggle={() => setLeftSidebarOpen(false)}
        />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PersistentMenu
          currentNote={currentNote}
          onCreateNote={onCreateNote}
          onDeleteNote={onDeleteNote}
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
          currentIndex={currentNoteIndex}
          totalNotes={notes.length}
          onNavigate={navigateToNote}
        />

        <div className="flex-1 overflow-hidden">
          {currentNote ? (
            <CanvasEditor
              note={currentNote}
              onUpdate={(updates) => onUpdateNote(currentNote.id, updates)}
              allExistingTags={allExistingTags}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-500 text-lg mb-4">Seleccioná o creá una nota</p>
                <button
                  onClick={onCreateNote}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Crear nueva nota
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - AI Assistant */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          rightSidebarOpen ? "w-80" : "w-0"
        } flex-shrink-0 overflow-hidden`}
      >
        <AiAssistantSidebar
          currentNote={currentNote}
          onToggle={() => setRightSidebarOpen(false)}
          onUpdateNote={(updates) => currentNote && onUpdateNote(currentNote.id, updates)}
        />
      </div>
    </div>
  )
}
