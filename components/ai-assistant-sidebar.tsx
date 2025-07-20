"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Sparkles, FileText, Tag, Lightbulb, RefreshCw } from "lucide-react"
import type { Note } from "@/types/note"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: Date
}

interface AiAssistantSidebarProps {
  currentNote: Note | undefined
  onToggle: () => void
  onUpdateNote: (updates: Partial<Note>) => void
}

export function AiAssistantSidebar({ currentNote, onToggle, onUpdateNote }: AiAssistantSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "¡Hola! Soy Dendrita, tu asistente de IA. Puedo ayudarte a generar títulos, resúmenes, sugerir etiquetas y mejorar el contenido de tus notas.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const quickActions = [
    {
      icon: FileText,
      label: "Generar resumen",
      action: "generar-resumen",
    },
    {
      icon: Tag,
      label: "Sugerir etiquetas",
      action: "sugerir-etiquetas",
    },
    {
      icon: Lightbulb,
      label: "Generar preguntas",
      action: "generar-preguntas",
    },
    {
      icon: Sparkles,
      label: "Mejorar contenido",
      action: "mejorar-contenido",
    },
  ]

  const executeQuickAction = async (action: string) => {
    if (!currentNote || isProcessing) return

    setIsProcessing(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Acción: ${quickActions.find((a) => a.action === action)?.label}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    let aiResponse = ""
    let noteUpdate: Partial<Note> = {}

    switch (action) {
      case "generar-resumen":
        const sentences = currentNote.content.split(".").filter((s) => s.trim().length > 0)
        const summary = sentences.slice(0, 2).join(". ") + (sentences.length > 2 ? "." : "")
        aiResponse = `He generado un nuevo resumen para tu nota: "${summary}"`
        noteUpdate = { subtitle: summary }
        break

      case "sugerir-etiquetas":
        const words = currentNote.content
          .toLowerCase()
          .split(/\W+/)
          .filter((w) => w.length > 5)
        const uniqueWords = Array.from(new Set(words))
        const suggestedTags = uniqueWords
          .slice(0, 3)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .filter((tag) => !currentNote.tags.includes(tag))
        aiResponse = `Te sugiero estas etiquetas: ${suggestedTags.join(", ")}`
        noteUpdate = { tags: [...currentNote.tags, ...suggestedTags] }
        break

      case "generar-preguntas":
        aiResponse = `Basándome en tu nota "${currentNote.title}", aquí tienes algunas preguntas de estudio:

1. ¿Cuáles son los conceptos principales mencionados?
2. ¿Cómo se relacionan estos conceptos entre sí?
3. ¿Qué aplicaciones prácticas tienen estos conocimientos?
4. ¿Qué aspectos requieren mayor profundización?`
        break

      case "mejorar-contenido":
        aiResponse = `He analizado tu nota y sugiero:

• Agregar más ejemplos específicos
• Incluir definiciones claras de términos técnicos
• Estructurar el contenido con subtítulos
• Añadir conclusiones o puntos clave al final`
        break
    }

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "ai",
      content: aiResponse,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, aiMessage])

    if (Object.keys(noteUpdate).length > 0) {
      onUpdateNote(noteUpdate)
    }

    setIsProcessing(false)
  }

  const sendMessage = (message: string = inputMessage) => {
    if (!message.trim() || isProcessing) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Entiendo tu consulta sobre "${message}". Basándome en tu nota actual, puedo ayudarte con eso. ¿Te gustaría que profundice en algún aspecto específico?`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="w-full h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <img src="/dendrita-logo.svg" alt="Dendrita" className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-900">Dendrita</h3>
              <p className="text-xs text-gray-600">Asistente de IA</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {currentNote && (
          <div className="text-xs text-gray-600 bg-white/70 rounded-md px-2 py-1 truncate">
            Contexto: {currentNote.title}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {currentNote && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones rápidas</h4>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => executeQuickAction(action.action)}
                disabled={isProcessing}
                className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
              >
                {isProcessing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <action.icon className="h-4 w-4" />}
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
              {message.role === "ai" ? (
                <img src="/dendrita-logo.svg" alt="Dendrita" className="w-5 h-5" />
              ) : (
                <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-medium">
                  U
                </div>
              )}
            </div>
            <div
              className={`flex-1 p-3 rounded-lg text-sm ${
                message.role === "user" ? "bg-gray-900 text-white ml-8" : "bg-gray-100 text-gray-900 mr-8"
              }`}
              style={{ whiteSpace: "pre-line" }}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre tu nota..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button onClick={() => sendMessage()} size="sm" disabled={!inputMessage.trim() || isProcessing}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Dendrita puede generar contenido inexacto. Verifica la información importante.
        </div>
      </div>
    </div>
  )
}
