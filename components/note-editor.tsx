"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Plus, Menu, MessageSquare } from "lucide-react"
import type { Note } from "@/types/note"

interface NoteEditorProps {
  note: Note
  onUpdate: (updates: Partial<Note>) => void
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
}

export function NoteEditor({
  note,
  onUpdate,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
}: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [subtitle, setSubtitle] = useState(note.subtitle)
  const [content, setContent] = useState(note.content)
  const [tags, setTags] = useState(note.tags)
  const [newTag, setNewTag] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = 68 // Simulated pagination
  const wordsPerPage = 250
  const words = content.split(/\s+/).filter((word) => word.length > 0)
  const totalWords = words.length
  const startIndex = (currentPage - 1) * wordsPerPage
  const endIndex = startIndex + wordsPerPage
  const currentPageContent = words.slice(startIndex, endIndex).join(" ")

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate({ title, subtitle, content, tags })
    }, 1000)

    return () => clearTimeout(timer)
  }, [title, subtitle, content, tags, onUpdate])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      setTags(updatedTags)
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove)
    setTags(updatedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with toggle controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          {!leftSidebarOpen && (
            <Button variant="ghost" size="sm" onClick={onToggleLeftSidebar} className="h-8 w-8 p-0">
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <div className="text-sm text-gray-500">
            {note.updatedAt.toLocaleDateString()} • {totalWords} palabras
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!rightSidebarOpen && (
            <Button variant="ghost" size="sm" onClick={onToggleRightSidebar} className="h-8 w-8 p-0">
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-8 flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-serif font-bold border-none p-0 mb-4 focus-visible:ring-0 bg-transparent"
            placeholder="Título de la nota"
          />

          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="text-lg text-gray-600 border-none p-0 mb-6 focus-visible:ring-0 bg-transparent"
            placeholder="Breve resumen del contenido de la nota"
          />

          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag, index) => (
              <Badge key={index} variant={index === 0 ? "default" : "secondary"} className="px-3 py-1 text-sm">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            <div className="flex items-center gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nueva etiqueta"
                className="w-32 h-8 text-sm"
              />
              <Button onClick={addTag} size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[500px] text-base leading-relaxed font-serif border-none p-0 focus-visible:ring-0 bg-transparent resize-none"
            placeholder="Comenzá a escribir tu nota aquí..."
          />
        </div>
      </div>

      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {currentPage > 2 && (
              <>
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage(1)}>
                  1
                </Button>
                {currentPage > 3 && <span className="px-2">...</span>}
              </>
            )}

            {currentPage > 1 && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage(currentPage - 1)}>
                {currentPage - 1}
              </Button>
            )}

            <Button variant="default" size="sm">
              {currentPage}
            </Button>

            {currentPage < totalPages && (
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage(currentPage + 1)}>
                {currentPage + 1}
              </Button>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && <span className="px-2">...</span>}
                <Button variant="ghost" size="sm" onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
