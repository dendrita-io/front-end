"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function ConnectionTest() {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const testConnection = async () => {
    setStatus("testing")
    setMessage("Probando conexión...")

    try {
      // Test basic connection
      const { data, error } = await supabase.from("profiles").select("count", { count: "exact", head: true })

      if (error) {
        setStatus("error")
        setMessage(`Error de conexión: ${error.message}`)
      } else {
        setStatus("success")
        setMessage("¡Conexión exitosa con Supabase!")
      }
    } catch (error) {
      setStatus("error")
      setMessage(`Error inesperado: ${error}`)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "error":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white">
      <h3 className="text-lg font-semibold mb-4">Test de Conexión Supabase</h3>

      <div className="space-y-4">
        <Button onClick={testConnection} disabled={status === "testing"} className="w-full">
          {status === "testing" ? "Probando..." : "Probar Conexión"}
        </Button>

        {status !== "idle" && (
          <div className={`flex items-center gap-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm">{message}</span>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>URL:</strong> https://cwbakqkcsohzmfiuwfjw.supabase.co
          </p>
          <p>
            <strong>Proyecto:</strong> cwbakqkcsohzmfiuwfjw
          </p>
        </div>
      </div>
    </div>
  )
}
