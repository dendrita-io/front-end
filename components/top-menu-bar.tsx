"use client"

import { useState } from "react"
import { Search, Plus, Trash2, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Note } from "@/types/note"

interface TopMenuBarProps {
  notes: Note[]
  currentNote: Note | undefined
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
  onToggleAi: () => void
  aiPanelOpen: boolean
  searchQuery: string
  onSearchChange: (query: string) => void
  filteredNotes: Note[]
  onNoteSelect: (noteId: string) => void
}

export function TopMenuBar({
  notes,
  currentNote,
  onCreateNote,
  onDeleteNote,
  onToggleAi,
  aiPanelOpen,
  searchQuery,
  onSearchChange,
  filteredNotes,
  onNoteSelect,
}: TopMenuBarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)} className="p-2">
              <Menu className="h-5 w-5" />
            </Button>

            {menuOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-medium text-gray-900">Notas ({notes.length})</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notes.map((note, index) => (
                    <button
                      key={note.id}
                      onClick={() => {
                        onNoteSelect(note.id)
                        setMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                        currentNote?.id === note.id ? "bg-gray-100" : ""
                      }`}
                    >
                      <div className="font-medium text-sm text-gray-900 truncate">{note.title}</div>
                      <div className="text-xs text-gray-500 truncate">{note.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSearchOpen(!searchOpen)} className="p-2">
              <Search className="h-5 w-5" />
            </Button>

            {searchOpen && (
              <div className="relative">
                <Input
                  placeholder="Buscar notas..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-64"
                  autoFocus
                />
                {searchQuery && filteredNotes.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {filteredNotes.slice(0, 5).map((note) => (
                      <button
                        key={note.id}
                        onClick={() => {
                          onNoteSelect(note.id)
                          setSearchOpen(false)
                          onSearchChange("")
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="font-medium text-sm text-gray-900 truncate">{note.title}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center section */}
        <div className="flex items-center gap-4">
          <Button onClick={onCreateNote} size="sm" className="bg-gray-900 hover:bg-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Nueva nota
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {currentNote && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDeleteNote(currentNote.id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant={aiPanelOpen ? "default" : "ghost"}
            size="sm"
            onClick={onToggleAi}
            className="flex items-center gap-2"
          >
            <img src="/dendrita-logo.svg" alt="Dendrita" className="w-4 h-4" />
            Dendrita
          </Button>
        </div>
      </div>

      {/* Close overlays when clicking outside */}
      {(menuOpen || searchOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setMenuOpen(false)
            setSearchOpen(false)
          }}
        />
      )}
    </header>
  )
}
