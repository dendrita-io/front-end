"use client"

import { Button } from "@/components/ui/button"
import { Menu, Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import type { Note } from "@/types/note"

interface PersistentMenuProps {
  currentNote: Note | undefined
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  currentIndex: number
  totalNotes: number
  onNavigate: (direction: "prev" | "next") => void
}

export function PersistentMenu({
  currentNote,
  onCreateNote,
  onDeleteNote,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen,
  rightSidebarOpen,
  currentIndex,
  totalNotes,
  onNavigate,
}: PersistentMenuProps) {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
      {/* Left Controls */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onToggleLeftSidebar} className="p-2">
          <Menu className="h-4 w-4" />
        </Button>

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("prev")}
          disabled={currentIndex === 0}
          className="p-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm text-gray-600 min-w-[80px] text-center">
          {totalNotes > 0 ? `${currentIndex + 1} de ${totalNotes}` : "0 de 0"}
        </span>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate("next")}
          disabled={currentIndex === totalNotes - 1}
          className="p-2"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Center Controls */}
      <div className="flex items-center gap-2">
        <Button onClick={onCreateNote} size="sm" className="bg-gray-900 hover:bg-gray-800">
          <Plus className="h-4 w-4 mr-2" />
          Nueva nota
        </Button>
      </div>

      {/* Right Controls */}
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

        <div className="h-4 w-px bg-gray-300 mx-2" />

        <Button
          variant={rightSidebarOpen ? "default" : "ghost"}
          size="sm"
          onClick={onToggleRightSidebar}
          className="flex items-center gap-2"
        >
          <img src="/dendrita-logo.svg" alt="Dendrita" className="w-4 h-4" />
          Dendrita
        </Button>
      </div>
    </div>
  )
}
