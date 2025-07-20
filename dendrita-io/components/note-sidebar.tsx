"use client"

import { useState } from "react"
import { Search, X, Edit3 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Note } from "@/types/note"

interface NoteSidebarProps {
  notes: Note[]
  activeNoteId: string | undefined
  onNoteSelect: (noteId: string) => void
  onNewNote: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  onToggle: () => void
}

export function NoteSidebar({
  notes,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  searchQuery,
  onSearchChange,
  onToggle,
}: NoteSidebarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-gray-600">Historial de notas</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onNewNote} className="h-8 w-8 p-0">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h1 className="text-lg font-semibold text-gray-900">Notas</h1>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => onNoteSelect(note.id)}
              className={`p-3 rounded-lg cursor-pointer transition-colors border-b border-gray-100 last:border-b-0 ${
                activeNoteId === note.id ? "bg-gray-50 border-l-2 border-l-gray-900" : "hover:bg-gray-50"
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-1 text-sm line-clamp-1">{note.title}</h3>
              <p className="text-xs text-gray-500 line-clamp-2">{note.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        {isSearchOpen ? (
          <div className="relative">
            <Input
              placeholder="Buscar en notas"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pr-8"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsSearchOpen(false)
                onSearchChange("")
              }}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setIsSearchOpen(true)}
            className="w-full justify-start text-gray-500 hover:text-gray-900"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar en notas
          </Button>
        )}
      </div>
    </div>
  )
}
