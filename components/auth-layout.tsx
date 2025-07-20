"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"

export function AuthLayout() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/dendrita-logo.svg" alt="Dendrita" className="w-10 h-10" />
            <h1 className="text-2xl font-serif font-bold text-gray-900">Dendrita</h1>
          </div>
          <p className="text-gray-600 text-sm">
            {isLogin ? "Accede a tu espacio de estudio" : "Crea tu cuenta y comienza a estudiar"}
          </p>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>© 2024 Dendrita. Plataforma de estudio inteligente.</p>
        </div>
      </div>
    </div>
  )
}
