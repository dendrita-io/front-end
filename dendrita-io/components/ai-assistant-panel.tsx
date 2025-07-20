"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send, Sparkles, FileText, Tag, Lightbulb } from "lucide-react"
import type { Note } from "@/types/note"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: Date
}

interface AiAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
  currentNote: Note | undefined
}

export function AiAssistantPanel({ isOpen, onClose, currentNote }: AiAssistantPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content:
        "¡Hola! Soy Dendrita, tu asistente de IA. Puedo ayudarte a generar títulos, resúmenes, sugerir etiquetas y responder preguntas sobre tus notas.",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const quickActions = [
    {
      icon: FileText,
      label: "Generar resumen",
      action: "Genera un resumen conciso de esta nota",
    },
    {
      icon: Tag,
      label: "Sugerir etiquetas",
      action: "Sugiere etiquetas relevantes para esta nota",
    },
    {
      icon: Lightbulb,
      label: "Generar preguntas",
      action: "Crea preguntas de estudio basadas en este contenido",
    },
    {
      icon: Sparkles,
      label: "Mejorar contenido",
      action: "Sugiere mejoras para el contenido de esta nota",
    },
  ]

  const sendMessage = (message: string = inputMessage) => {
    if (!message.trim()) return

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
        content: `Basándome en tu nota "${currentNote?.title || "actual"}", aquí tienes mi respuesta: ${message.includes("resumen") ? "Esta nota trata sobre conceptos fundamentales que requieren comprensión profunda. Los puntos clave incluyen..." : "He analizado el contenido y puedo ayudarte con eso. ¿Te gustaría que profundice en algún aspecto específico?"}`,
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

  if (!isOpen) return null

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
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
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {currentNote && (
          <div className="text-xs text-gray-600 bg-white/70 rounded-md px-2 py-1">Contexto: {currentNote.title}</div>
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
                onClick={() => sendMessage(action.action)}
                className="h-auto p-2 flex flex-col items-center gap-1 text-xs"
              >
                <action.icon className="h-4 w-4" />
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
          />
          <Button onClick={() => sendMessage()} size="sm" disabled={!inputMessage.trim()}>
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
