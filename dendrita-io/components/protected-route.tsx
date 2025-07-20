"use client"

import type React from "react"

import { useAuthContext } from "@/components/auth-provider"
import { AuthLayout } from "@/components/auth-layout"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <img src="/dendrita-logo.svg" alt="Dendrita" className="w-8 h-8 animate-pulse" />
          <div className="text-lg font-serif text-gray-600">Cargando...</div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthLayout />
  }

  return <>{children}</>
}
