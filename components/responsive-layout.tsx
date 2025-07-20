"use client"

import type React from "react"

import { useState, useEffect } from "react"

export function useResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  return { isMobile, isTablet }
}

interface ResponsiveLayoutProps {
  children: React.ReactNode
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
}

export function ResponsiveLayout({
  children,
  leftSidebarOpen,
  rightSidebarOpen,
  onToggleLeftSidebar,
  onToggleRightSidebar,
}: ResponsiveLayoutProps) {
  const { isMobile, isTablet } = useResponsiveLayout()

  // Auto-collapse sidebars on mobile
  useEffect(() => {
    if (isMobile) {
      // On mobile, only show one sidebar at a time
      if (leftSidebarOpen && rightSidebarOpen) {
        onToggleRightSidebar()
      }
    }
  }, [isMobile, leftSidebarOpen, rightSidebarOpen])

  return (
    <div className="relative">
      {children}

      {/* Mobile overlay */}
      {isMobile && (leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => {
            if (leftSidebarOpen) onToggleLeftSidebar()
            if (rightSidebarOpen) onToggleRightSidebar()
          }}
        />
      )}
    </div>
  )
}
