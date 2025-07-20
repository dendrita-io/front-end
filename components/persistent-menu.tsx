"use client"

import { ChevronLeft, ChevronRight, Plus, Trash2, PanelLeft, PanelRight, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Note } from "@/types/note"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/supabase"
import { signOut } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface PersistentMenuProps {
  currentNote: Note | undefined
  onCreateNote: () => void
  onDeleteNote: (noteId: string) => void
  onToggleLeftSidebar: () => void
  onToggleRightSidebar: () => void
  leftSidebarOpen: boolean
  rightSidebarOpen: boolean
  currentIndex: number
  totalNotes: number
  onNavigate: (direction: "prev" | "next") => void
  user: User | null
  profile: Profile | null
}

export function PersistentMenu({
  currentNote,
  onCreateNote,
  onDeleteNote,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen,
  rightSidebarOpen,
  currentIndex,
  totalNotes,
  onNavigate,
  user,
  profile,
}: PersistentMenuProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await signOut()
    if (!error) {
      router.push("/auth")
    } else {
      console.error("Error logging out:", error.message)
    }
  }

  return (
    <header className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-2 shadow-sm z-10">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleLeftSidebar}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onCreateNote}>
            <Plus className="h-5 w-5" />
          </Button>
          {currentNote && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteNote(currentNote.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onNavigate("prev")} disabled={currentIndex <= 0}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-gray-500 font-medium">
            {totalNotes > 0 ? `${currentIndex + 1} / ${totalNotes}` : "0 / 0"}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("next")}
            disabled={currentIndex >= totalNotes - 1}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleRightSidebar}>
            <PanelRight className="h-5 w-5" />
          </Button>
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url || "/placeholder-user.jpg"}
                      alt={profile?.full_name || "User"}
                    />
                    <AvatarFallback>
                      {profile?.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
