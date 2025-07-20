"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  multiline?: boolean
  autoResize?: boolean
}

export function EditableText({
  value,
  onChange,
  className,
  placeholder = "Escribir...",
  multiline = false,
  autoResize = false,
}: EditableTextProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localValue, setLocalValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if (multiline && autoResize) {
        adjustTextareaHeight()
      }
    }
  }, [isEditing, multiline, autoResize])

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current as HTMLTextAreaElement
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(localValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      handleBlur()
    } else if (e.key === "Escape") {
      setLocalValue(value)
      setIsEditing(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLocalValue(e.target.value)
    if (multiline && autoResize) {
      adjustTextareaHeight()
    }
  }

  const displayValue = localValue || placeholder
  const isEmpty = !localValue

  if (isEditing) {
    const InputComponent = multiline ? "textarea" : "input"
    return (
      <InputComponent
        ref={inputRef as any}
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-transparent border-none outline-none resize-none",
          "focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 rounded-md px-2 py-1 -mx-2 -my-1",
          className,
        )}
        placeholder={placeholder}
        style={multiline && autoResize ? { minHeight: "1.5em", overflow: "hidden" } : undefined}
      />
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-text hover:bg-gray-50 rounded-md px-2 py-1 -mx-2 -my-1 transition-colors",
        isEmpty && "text-gray-400",
        className,
      )}
      style={multiline ? { whiteSpace: "pre-wrap", wordBreak: "break-word" } : undefined}
    >
      {displayValue}
    </div>
  )
}
