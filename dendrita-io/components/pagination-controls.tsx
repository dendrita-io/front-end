"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Note } from "@/types/note"

interface PaginationControlsProps {
  currentIndex: number
  totalNotes: number
  onNavigate: (direction: "prev" | "next") => void
  currentNote: Note
}

export function PaginationControls({ currentIndex, totalNotes, onNavigate, currentNote }: PaginationControlsProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => onNavigate("prev")}
            disabled={currentIndex === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {currentIndex + 1} de {totalNotes}
              </div>
              <div className="text-xs text-gray-500">{currentNote.createdAt.toLocaleDateString()}</div>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(totalNotes, 5) }, (_, i) => {
                let pageIndex = i
                if (totalNotes > 5) {
                  const start = Math.max(0, currentIndex - 2)
                  const end = Math.min(totalNotes, start + 5)
                  pageIndex = start + i
                  if (pageIndex >= end) return null
                }

                return (
                  <div
                    key={pageIndex}
                    className={`w-2 h-2 rounded-full ${pageIndex === currentIndex ? "bg-gray-900" : "bg-gray-300"}`}
                  />
                )
              })}
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => onNavigate("next")}
            disabled={currentIndex === totalNotes - 1}
            className="flex items-center gap-2"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
