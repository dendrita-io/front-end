"use client"

import { useState, useEffect, useRef } from "react"
import { EditableText } from "@/components/editable-text"
import { EditableTag } from "@/components/editable-tag"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, RefreshCw } from "lucide-react"
import type { Note } from "@/types/note"

interface CanvasEditorProps {
  note: Note
  onUpdate: (updates: Partial<Note>) => void
  allExistingTags: string[]
}

export function CanvasEditor({ note, onUpdate, allExistingTags }: CanvasEditorProps) {
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [isGeneratingTags, setIsGeneratingTags] = useState(false)
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save functionality
  const [pendingUpdates, setPendingUpdates] = useState<Partial<Note>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(pendingUpdates).length > 0) {
        onUpdate(pendingUpdates)
        setPendingUpdates({})
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [pendingUpdates, onUpdate])

  const updateField = (field: keyof Note, value: any) => {
    setPendingUpdates((prev) => ({ ...prev, [field]: value }))
  }

  const generateAiTitle = async () => {
    if (!note.content.trim()) return

    setIsGeneratingTitle(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const words = note.content.split(" ").filter((w) => w.length > 3)
    const keyWords = words.slice(0, 4)
    const aiTitle = keyWords.join(" ").charAt(0).toUpperCase() + keyWords.join(" ").slice(1)

    updateField("title", aiTitle)
    setIsGeneratingTitle(false)
  }

  const generateAiSummary = async () => {
    if (!note.content.trim()) return

    setIsGeneratingSummary(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const sentences = note.content.split(".").filter((s) => s.trim().length > 0)
    const aiSummary = sentences.slice(0, 2).join(". ") + (sentences.length > 2 ? "." : "")

    updateField("subtitle", aiSummary)
    setIsGeneratingSummary(false)
  }

  const generateAiTags = async () => {
    if (!note.content.trim()) return

    setIsGeneratingTags(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const words = note.content
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 5)
    const uniqueWords = Array.from(new Set(words))
    const suggestedTags = uniqueWords
      .slice(0, 3)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .filter((tag) => !note.tags.includes(tag))

    updateField("tags", [...note.tags, ...suggestedTags])
    setIsGeneratingTags(false)
  }

  const addNewTag = () => {
    const newTag = "Nueva etiqueta"
    updateField("tags", [...note.tags, newTag])
  }

  const updateTag = (index: number, newValue: string) => {
    const updatedTags = [...note.tags]
    if (newValue.trim()) {
      updatedTags[index] = newValue.trim()
    } else {
      updatedTags.splice(index, 1)
    }
    updateField("tags", updatedTags)
  }

  return (
    <div className="h-full overflow-auto bg-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* AI-Generated Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Título generado por IA</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAiTitle}
              disabled={isGeneratingTitle || !note.content.trim()}
              className="h-6 w-6 p-0 ml-2"
            >
              
            </Button>
          </div>
          <EditableText
            value={note.title}
            onChange={(value) => updateField("title", value)}
            className="text-4xl font-serif font-bold text-gray-900 leading-tight"
            placeholder="Título de la nota..."
            multiline={false}
          />
        </div>

        {/* AI-Generated Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Resumen generado por IA</span>
            
          </div>
          <EditableText
            value={note.subtitle}
            onChange={(value) => updateField("subtitle", value)}
            className="text-lg text-gray-600 leading-relaxed"
            placeholder="Resumen del contenido..."
            multiline={true}
          />
        </div>

        {/* Editable Tags */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-gray-700">Etiquetas</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={generateAiTags}
              disabled={isGeneratingTags || !note.content.trim()}
              className="h-6 w-6 p-0"
            >
              <RefreshCw className={`h-3 w-3 ${isGeneratingTags ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={addNewTag} className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag, index) => (
              <EditableTag
                key={index}
                value={tag}
                onChange={(newValue) => updateTag(index, newValue)}
                onDelete={() => updateTag(index, "")}
                suggestions={allExistingTags}
                variant={index === 0 ? "default" : "secondary"}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <EditableText
            value={note.content}
            onChange={(value) => updateField("content", value)}
            className="text-base leading-relaxed font-serif text-gray-900 min-h-[400px]"
            placeholder="Comenzá a escribir tu nota aquí..."
            multiline={true}
            autoResize={true}
          />
        </div>

        {/* Content Statistics */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 pt-4">
          <span>{note.content.split(" ").filter((w) => w.length > 0).length} palabras</span>
          <span>Última actualización: {note.updatedAt.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  )
}
