"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react"
import { signUp } from "@/lib/supabase"

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await signUp(formData.email, formData.password, formData.name)

      if (error) {
        alert(error.message)
      } else if (data.user) {
        alert("¡Cuenta creada exitosamente! Revisa tu email para confirmar tu cuenta.")
        // Optionally switch to login form
        onSwitchToLogin()
      }
    } catch (error) {
      console.error("Registration error:", error)
      alert("Error al crear la cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    return strength
  }

  const strength = passwordStrength(formData.password)
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"]
  const strengthLabels = ["Débil", "Regular", "Buena", "Fuerte"]

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">Crear Cuenta</h2>
        <p className="text-sm text-gray-600">Únete a Dendrita y potencia tu aprendizaje</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre completo
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="pl-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              placeholder="Tu nombre completo"
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo electrónico
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              placeholder="tu@email.com"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {formData.password && (
            <div className="space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((level) => (
                  <div
                    key={level}
                    className={`h-1 flex-1 rounded-full ${
                      level < strength ? strengthColors[strength - 1] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                Seguridad: {strength > 0 ? strengthLabels[strength - 1] : "Muy débil"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirmar contraseña
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className="pl-10 pr-10 h-11 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start space-x-2">
          <div className="relative">
            <input
              id="terms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-500 sr-only"
            />
            <div
              onClick={() => setAcceptTerms(!acceptTerms)}
              className={`w-4 h-4 border-2 rounded cursor-pointer flex items-center justify-center ${
                acceptTerms ? "bg-gray-900 border-gray-900" : "border-gray-300"
              }`}
            >
              {acceptTerms && <Check className="h-3 w-3 text-white" />}
            </div>
          </div>
          <Label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed cursor-pointer">
            Acepto los{" "}
            <button type="button" className="text-gray-900 hover:underline">
              términos y condiciones
            </button>{" "}
            y la{" "}
            <button type="button" className="text-gray-900 hover:underline">
              política de privacidad
            </button>
          </Label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            formData.password !== formData.confirmPassword ||
            !acceptTerms
          }
          className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creando cuenta...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Crear Cuenta
              <ArrowRight className="h-4 w-4" />
            </div>
          )}
        </Button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">o regístrate con</span>
          </div>
        </div>

        {/* Social Registration */}
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 bg-transparent"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continuar con Google
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 border-gray-200 hover:bg-gray-50 bg-transparent"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Continuar con Facebook
          </Button>
        </div>

        {/* Switch to Login */}
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}
