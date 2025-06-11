"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { DropdownMenuLabel } from "@/components/ui/dropdown-menu"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Film, MapPin, Menu, Search, User, X, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "./auth-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  classification: string;
  genres: string[];
  // adicione outras propriedades conforme necessário
}

interface Cinema {
  id: string;
  name: string;
  address: string;
  // adicione outras propriedades conforme necessário
}

interface Promotion {
  slug: string;
  title: string;
  description: string;
}

interface SearchResults {
  movies: Movie[];
  cinemas: Cinema[];
  promotions: Promotion[];
}

export default function Header() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [location, setLocation] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults>({
  movies: [],
  cinemas: [],
  promotions: [],
  });

  const [locationShared, setLocationShared] = useLocalStorage("locationShared", "false");

  // Mock das promoções para busca
  const mockPromotions = [
    {
      slug: "terca-do-cinema",
      title: "Terça do Cinema",
      description: "Todos os ingressos pela metade do preço às terças-feiras.",
    },
    {
      slug: "combo-familia",
      title: "Combo Família",
      description: "4 ingressos + 2 pipocas grandes + 4 refrigerantes por um preço especial.",
    },
    {
      slug: "segunda-premiada",
      title: "Segunda Premiada",
      description: "Pipoca grande grátis na compra de dois ingressos às segundas-feiras.",
    },
    {
      slug: "combo-casal",
      title: "Combo Casal",
      description: "2 ingressos + 1 pipoca grande + 2 refrigerantes médios.",
    },
    {
      slug: "desconto-estudante",
      title: "Desconto Estudante",
      description: "50% de desconto para estudantes em qualquer sessão com carteirinha válida.",
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const storedLocation = localStorage.getItem("userLocation")
    const locationPermissionAsked = localStorage.getItem("locationPermissionAsked")
    const locationShared = localStorage.getItem("locationShared")

    if (storedLocation) {
      setLocation(storedLocation)
    } else if (locationPermissionAsked && locationShared === "false") {
      setLocation("Brasil")
      localStorage.setItem("userLocation", "Brasil")
    } else {
      setLocation("Selecionar local")
    }
  }
}, [])

  const handleLocationSelect = (newLocation: string) => {
  setLocation(newLocation)
  if (typeof window !== 'undefined') {
    localStorage.setItem("userLocation", newLocation)
  }
}

  const isAdmin = user?.role === "admin"

  // Efeito para realizar a busca quando o termo de busca mudar
  useEffect(() => {
    if (searchTerm.length > 0) {
      // Importar os dados mock
      import("@/lib/mock-data").then(({ mockMovies, mockCinemas }: { mockMovies: Movie[], mockCinemas: Cinema[] }) => {
        // Buscar filmes
        const filteredMovies = mockMovies
          .filter(
            (movie) =>
              movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              movie.genres.some((genre) => genre.toLowerCase().includes(searchTerm.toLowerCase())),
          )
          .slice(0, 5)

        // Buscar cinemas
        const filteredCinemas = mockCinemas
          .filter(
            (cinema) =>
              cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              cinema.address.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 5)

        // Buscar promoções
        const filteredPromotions = mockPromotions
          .filter(
            (promo) =>
              promo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              promo.description.toLowerCase().includes(searchTerm.toLowerCase()),
          )
          .slice(0, 5)

        setSearchResults({
          movies: filteredMovies,
          cinemas: filteredCinemas,
          promotions: filteredPromotions,
        })
      })
    } else {
      setSearchResults({
        movies: [],
        cinemas: [],
        promotions: [],
      })
    }
  }, [searchTerm])

  // Fechar os resultados de busca ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSearchResults && !(event.target as Element).closest(".search-container")) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSearchResults])

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
                <DropdownMenuLabel>Escolha sua localização</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {locationShared === "false" ? (
                  <DropdownMenuItem onClick={() => handleLocationSelect("Brasil")}>
                    Brasil (Todos os cinemas)
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleLocationSelect("Manaus, AM")}>
                      Manaus, AM
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/cadastrar-endereco">Cadastrar endereço completo</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="hidden md:flex relative w-full max-w-sm items-center search-container">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar filmes, cinemas..."
              className="pl-8 bg-background/50 border-muted focus-visible:ring-primary"
              onChange={(e) => {
                setSearchTerm(e.target.value)
                if (e.target.value.length > 0) {
                  setShowSearchResults(true)
                } else {
                  setShowSearchResults(false)
                }
              }}
              onFocus={() => {
                if (searchTerm.length > 0) {
                  setShowSearchResults(true)
                }
              }}
              value={searchTerm}
            />
            {showSearchResults && searchTerm.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[70vh] overflow-y-auto">
                <div className="p-2">
                  {searchResults.movies.length === 0 &&
                  searchResults.cinemas.length === 0 &&
                  searchResults.promotions.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      Nenhum resultado encontrado para "{searchTerm}"
                    </div>
                  ) : (
                    <>
                      {searchResults.movies.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Filmes</h3>
                          <div className="space-y-1">
                            {searchResults.movies.map((movie) => (
                              <Link
                                key={movie.id}
                                href={`/filmes/${movie.id}`}
                                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                                onClick={() => setShowSearchResults(false)}
                              >
                                <div className="relative w-8 h-12 overflow-hidden rounded">
                                  <Image
                                    src={movie.posterUrl || "/placeholder.svg?height=48&width=32"}
                                    alt={movie.title}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{movie.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {movie.classification} • {movie.genres.slice(0, 2).join(", ")}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.cinemas.length > 0 && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Cinemas</h3>
                          <div className="space-y-1">
                            {searchResults.cinemas.map((cinema) => (
                              <Link
                                key={cinema.id}
                                href={`/cinemas/${cinema.id}`}
                                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                                onClick={() => setShowSearchResults(false)}
                              >
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{cinema.name}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                    {cinema.address}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.promotions.length > 0 && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-2">Promoções</h3>
                          <div className="space-y-1">
                            {searchResults.promotions.map((promo) => (
                              <Link
                                key={promo.slug}
                                href={`/promocoes/${promo.slug}`}
                                className="flex items-center gap-2 p-2 hover:bg-muted rounded-md"
                                onClick={() => setShowSearchResults(false)}
                              >
                                <Ticket className="h-4 w-4 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{promo.title}</p>
                                  <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                    {promo.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="border-t p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Fechar
                  </Button>
                </div>
              </div>
            )}
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
                  <Input
                    type="search"
                    placeholder="Buscar filmes, cinemas..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm.length > 0 && (
                    <div className="absolute right-2 top-2">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSearchTerm("")}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Limpar busca</span>
                      </Button>
                    </div>
                  )}
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
