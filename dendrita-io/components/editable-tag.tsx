"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface EditableTagProps {
  value: string
  onChange: (value: string) => void
  onDelete: () => void
  suggestions?: string[]
  variant?: "default" | "secondary"
}

export function EditableTag({ value, onChange, onDelete, suggestions = [], variant = "secondary" }: EditableTagProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const filteredSuggestions = suggestions.filter(
    (suggestion) => suggestion.toLowerCase().includes(localValue.toLowerCase()) && suggestion !== localValue,
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
    setShowSuggestions(true)
  }

  const handleBlur = () => {
    setTimeout(() => {
      setIsEditing(false)
      setShowSuggestions(false)
      if (localValue.trim()) {
        onChange(localValue.trim())
      } else {
        onDelete()
      }
    }, 150)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleBlur()
    } else if (e.key === "Escape") {
      setLocalValue(value)
      setIsEditing(false)
      setShowSuggestions(false)
    } else if (e.key === "Backspace" && localValue === "") {
      onDelete()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value)
    setShowSuggestions(true)
  }

  const selectSuggestion = (suggestion: string) => {
    setLocalValue(suggestion)
    onChange(suggestion)
    setIsEditing(false)
    setShowSuggestions(false)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  if (isEditing) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          value={localValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="px-3 py-1 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[80px]"
          placeholder="Etiqueta..."
        />
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-32 overflow-y-auto">
            {filteredSuggestions.slice(0, 5).map((suggestion, index) => (
              <button
                key={index}
                onClick={() => selectSuggestion(suggestion)}
                className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Badge
      variant={variant}
      className={cn("px-3 py-1 text-sm cursor-pointer hover:bg-opacity-80 transition-colors", "group")}
      onClick={handleClick}
    >
      {value}
      <button
        onClick={handleDeleteClick}
        className="ml-2 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
