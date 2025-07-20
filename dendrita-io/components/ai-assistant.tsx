"use client"

import type React from "react"

import { useState } from "react"
import { Send, Mic, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Note } from "@/types/note"

interface Message {
  id: string
  role: "user" | "ai"
  content: string
  timestamp: Date
}

interface AiAssistantProps {
  activeNote: Note | undefined
  onToggle: () => void
}

export function AiAssistant({ activeNote, onToggle }: AiAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "¡Hola! Soy Dendrita, tu asistente de IA para el estudio. ¿En qué puedo ayudarte con tus notas?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "user",
      content: "¿Puedes ayudarme a generar preguntas sobre este contenido?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Basándome en tu nota "${activeNote?.title || "actual"}", puedo ayudarte a generar preguntas de estudio, resumir conceptos clave, o explicar temas complejos. ¿Qué te gustaría explorar primero?`,
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
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header with Dendrita branding */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0">
              <img src="/dendrita-logo.svg" alt="Dendrita" className="w-full h-full" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Dendrita</h3>
              <p className="text-xs text-gray-500">Asistente de IA</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle} className="h-8 w-8 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {activeNote && (
          <div className="text-xs text-gray-600 bg-gray-100 rounded-md px-2 py-1">Contexto: {activeNote.title}</div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback
                className={message.role === "ai" ? "bg-white border border-gray-200" : "bg-gray-900 text-white"}
              >
                {message.role === "ai" ? <img src="/dendrita-logo.svg" alt="Dendrita" className="w-5 h-5" /> : "U"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex-1 p-3 rounded-lg text-sm ${
                message.role === "user" ? "bg-gray-900 text-white ml-8" : "bg-gray-50 text-gray-900 mr-8"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre tus notas..."
            className="flex-1 bg-white"
          />
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
            <Mic className="h-4 w-4" />
          </Button>
          <Button onClick={sendMessage} size="sm" className="h-10 w-10 p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Dendrita puede cometer errores. Verifica la información importante.
        </div>
      </div>
    </div>
  )
}
