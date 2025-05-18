"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Film, MapPin, Menu, Search, User, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [location, setLocation] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Mock geolocation - in a real app, this would use the browser's geolocation API
    const storedLocation = localStorage.getItem("userLocation")
    if (storedLocation) {
      setLocation(storedLocation)
    } else {
      setLocation("São Paulo, SP")
      localStorage.setItem("userLocation", "São Paulo, SP")
    }
  }, [])

  const handleLocationSelect = (newLocation: string) => {
    setLocation(newLocation)
    localStorage.setItem("userLocation", newLocation)
  }

  const isAdmin = user?.role === "admin"

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-black/90 backdrop-blur-sm shadow-md" : "bg-gradient-to-b from-black/80 to-transparent",
      )}
    >
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">CineXplorer</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/em-cartaz"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/em-cartaz" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Em Cartaz
            </Link>
            <Link
              href="/cinemas"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/cinemas" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Cinemas
            </Link>
            <Link
              href="/promocoes"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/promocoes" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Promoções
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname.startsWith("/admin") ? "text-primary" : "text-muted-foreground",
                )}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm text-muted-foreground hover:text-primary">
                {location || "Selecionar local"}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Escolha sua cidade</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLocationSelect("São Paulo, SP")}>São Paulo, SP</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocationSelect("Rio de Janeiro, RJ")}>
                  Rio de Janeiro, RJ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocationSelect("Belo Horizonte, MG")}>
                  Belo Horizonte, MG
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLocationSelect("Brasília, DF")}>Brasília, DF</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar filmes, cinemas..."
              className="pl-8 bg-background/50 border-muted focus-visible:ring-primary"
            />
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/20 text-primary">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/minha-conta">Minha Conta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/meus-ingressos">Meus Ingressos</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Painel Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link href="/login">
                <User className="h-4 w-4 mr-2" />
                Entrar
              </Link>
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 h-full">
                <div className="flex items-center justify-between">
                  <Link href="/" className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary" />
                    <span className="text-lg font-bold">CineXplorer</span>
                  </Link>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetTrigger>
                </div>

                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar filmes, cinemas..." className="pl-8" />
                </div>

                <div className="flex items-center gap-2 px-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{location || "Selecionar local"}</span>
                </div>

                <nav className="flex flex-col gap-4">
                  <Link href="/em-cartaz" className="flex items-center gap-2 text-sm font-medium">
                    Em Cartaz
                  </Link>
                  <Link href="/cinemas" className="flex items-center gap-2 text-sm font-medium">
                    Cinemas
                  </Link>
                  <Link href="/promocoes" className="flex items-center gap-2 text-sm font-medium">
                    Promoções
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="flex items-center gap-2 text-sm font-medium">
                      Painel Admin
                    </Link>
                  )}
                </nav>

                <div className="mt-auto">
                  {!user ? (
                    <Button asChild className="w-full">
                      <Link href="/login">Entrar</Link>
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/20 text-primary">{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full" onClick={() => logout()}>
                        Sair
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
