"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Plus, X, RefreshCw } from "lucide-react"
import type { Note } from "@/types/note"

interface NoteContentProps {
  note: Note
  onUpdate: (updates: Partial<Note>) => void
  allNotes: Note[]
}

export function NoteContent({ note, onUpdate, allNotes }: NoteContentProps) {
  const [content, setContent] = useState(note.content)
  const [isGenerating, setIsGenerating] = useState(false)
  const [newTag, setNewTag] = useState("")

  // Get all existing tags from all notes for suggestions
  const allExistingTags = Array.from(new Set(allNotes.flatMap((n) => n.tags))).filter((tag) => tag.length > 0)

  // Auto-save content
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== note.content) {
        onUpdate({ content })
        // Simulate AI generation when content changes significantly
        if (content.length > 100 && content.length % 200 === 0) {
          generateAiContent(content)
        }
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, note.content, onUpdate])

  const generateAiContent = async (noteContent: string) => {
    setIsGenerating(true)

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate AI title and summary based on content
    const words = noteContent.split(" ").filter((w) => w.length > 0)
    const aiTitle = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "")
    const aiSummary = `Resumen generado automáticamente: ${words.slice(0, 20).join(" ")}${words.length > 20 ? "..." : ""}`

    // Generate suggested tags based on content keywords
    const suggestedTags = [
      ...note.tags,
      ...words
        .filter((word) => word.length > 6)
        .slice(0, 3)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()),
    ].slice(0, 5)

    onUpdate({
      aiGenerated: {
        title: aiTitle,
        summary: aiSummary,
        suggestedTags: Array.from(new Set(suggestedTags)),
      },
    })

    setIsGenerating(false)
  }

  const addTag = (tag: string) => {
    if (tag.trim() && !note.tags.includes(tag.trim())) {
      onUpdate({ tags: [...note.tags, tag.trim()] })
    }
    setNewTag("")
  }

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: note.tags.filter((tag) => tag !== tagToRemove) })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag(newTag)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* AI-Generated Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">Título generado por IA</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => generateAiContent(content)}
            disabled={isGenerating}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`h-3 w-3 ${isGenerating ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 leading-tight">
          {note.aiGenerated?.title || note.title}
        </h1>
      </div>

      {/* AI-Generated Summary */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-green-600" />
          <span className="text-xs text-green-600 font-medium">Resumen generado por IA</span>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">{note.aiGenerated?.summary || note.subtitle}</p>
      </div>

      {/* Tags Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-gray-700">Etiquetas</span>
          <span className="text-xs text-gray-500">({note.tags.length} aplicadas)</span>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="px-3 py-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-2 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* AI Suggested Tags */}
        {note.aiGenerated?.suggestedTags && note.aiGenerated.suggestedTags.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Sugerencias de IA</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {note.aiGenerated.suggestedTags
                .filter((tag) => !note.tags.includes(tag))
                .map((tag, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addTag(tag)}
                    className="h-7 px-2 text-xs border-dashed"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Add New Tag */}
        <div className="flex gap-2">
          <Input
            placeholder="Agregar etiqueta..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 h-8"
            list="existing-tags"
          />
          <datalist id="existing-tags">
            {allExistingTags.map((tag, index) => (
              <option key={index} value={tag} />
            ))}
          </datalist>
          <Button onClick={() => addTag(newTag)} size="sm" disabled={!newTag.trim()} className="h-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-3">Contenido de la nota</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Comenzá a escribir tu nota aquí. El título y resumen se generarán automáticamente..."
          className="min-h-[400px] text-base leading-relaxed font-serif border-gray-200 focus:border-gray-400 focus:ring-gray-400 resize-none"
        />
        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
          <span>{content.split(" ").filter((w) => w.length > 0).length} palabras</span>
          <span>Última actualización: {note.updatedAt.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* AI Generation Status */}
      {isGenerating && (
        <div className="flex items-center gap-2 text-blue-600 text-sm">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Generando contenido con IA...</span>
        </div>
      )}
    </div>
  )
}
