"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Grid, List, MapPin, Search } from "lucide-react"
import CinemaCard from "@/components/cinema-card"
import { mockCinemas } from "@/lib/mock-data"
import type { Cinema } from "@/lib/types"

export default function CinemasPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState<string>("todos")
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid")
  const [userLocation, setUserLocation] = useState<string | null>(null)
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Get user location from localStorage
    const storedLocation = localStorage.getItem("userLocation")
    if (storedLocation) {
      setUserLocation(storedLocation)
    }

    // Get user coordinates from localStorage
    const storedCoordinates = localStorage.getItem("userCoordinates")
    if (storedCoordinates) {
      try {
        setUserCoordinates(JSON.parse(storedCoordinates))
      } catch (error) {
        console.error("Error parsing user coordinates:", error)
      }
    }
  }, [])

  // Get all available cities from cinemas
  const allCities = Array.from(
    new Set(
      mockCinemas.map((cinema) => {
        const address = cinema.address.split(", ")
        return address[address.length - 1]
      }),
    ),
  )

  // Get all available room types from cinemas
  const allRoomTypes = Array.from(new Set(mockCinemas.flatMap((cinema) => cinema.roomTypes)))

  // Calculate distance between user and cinema (if user location is available)
  const cinemasWithDistance = mockCinemas.map((cinema) => {
    let distance = null
    if (userCoordinates && cinema.location) {
      // Calculate distance using Haversine formula
      const R = 6371 // Radius of the Earth in km
      const dLat = (cinema.location.lat - userCoordinates.lat) * (Math.PI / 180)
      const dLon = (cinema.location.lng - userCoordinates.lng) * (Math.PI / 180)
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(userCoordinates.lat * (Math.PI / 180)) *
          Math.cos(cinema.location.lat * (Math.PI / 180)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      distance = R * c
    }
    return { ...cinema, distance }
  })

  // Sort cinemas by distance if user location is available
  const sortedCinemas = [...cinemasWithDistance].sort((a, b) => {
    if (a.distance !== null && b.distance !== null) {
      return a.distance - b.distance
    }
    return 0
  })

  // Apply filters
  const filteredCinemas = sortedCinemas.filter((cinema) => {
    // Search filter
    const matchesSearch =
      cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchQuery.toLowerCase())

    // City filter
    const cinemaCity = cinema.address.split(", ").pop() || ""
    const matchesCity = cityFilter === "todos" || cinemaCity.includes(cityFilter)

    // Room type filter
    const matchesRoomType = roomTypeFilter === "todos" || cinema.roomTypes.includes(roomTypeFilter)

    return matchesSearch && matchesCity && matchesRoomType
  })

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cinemas</h1>
          <p className="text-muted-foreground mt-1">
            {userLocation && userLocation !== "Localização não compartilhada"
              ? `Cinemas próximos a ${userLocation}`
              : "Todos os cinemas disponíveis"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            aria-label="Visualização em grade"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="Visualização em lista"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("map")}
            aria-label="Visualização em mapa"
          >
            <MapPin className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cinemas..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cidade</label>
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as cidades</SelectItem>
                {allCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Sala</label>
            <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                {allRoomTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSearchQuery("")
              setCityFilter("todos")
              setRoomTypeFilter("todos")
            }}
          >
            Limpar filtros
          </Button>
        </div>

        <div className="flex-1">
          <Tabs defaultValue={viewMode} onValueChange={(value) => setViewMode(value as any)} className="w-full">
            <TabsContent value="grid" className="mt-0">
              {filteredCinemas.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCinemas.map((cinema) => (
                    <CinemaCard key={cinema.id} cinema={cinema} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum cinema encontrado</h3>
                  <p className="text-muted-foreground">
                    Não encontramos cinemas que correspondam aos seus filtros. Tente ajustar os critérios de busca.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              {filteredCinemas.length > 0 ? (
                <div className="space-y-4">
                  {filteredCinemas.map((cinema) => (
                    <CinemaListItem key={cinema.id} cinema={cinema} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum cinema encontrado</h3>
                  <p className="text-muted-foreground">
                    Não encontramos cinemas que correspondam aos seus filtros. Tente ajustar os critérios de busca.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <div className="bg-muted rounded-lg overflow-hidden h-[600px] flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Visualização de mapa</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Em um ambiente de produção, aqui seria exibido um mapa interativo com a localização dos cinemas.
                    {userLocation && userLocation !== "Localização não compartilhada" && (
                      <>
                        {" "}
                        Você está em <strong>{userLocation}</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface CinemaListItemProps {
  cinema: Cinema & { distance?: number | null }
}

function CinemaListItem({ cinema }: CinemaListItemProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-card/50 transition-colors">
      <div className="relative h-32 w-48 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={cinema.imageUrl || "/placeholder.svg?height=300&width=600"}
          alt={cinema.name}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg">{cinema.name}</h3>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 text-yellow-400"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="font-medium">{cinema.rating}</span>
            <span className="text-xs text-muted-foreground">({cinema.reviewCount} avaliações)</span>
          </div>
        </div>
        <div className="flex items-start gap-2 my-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">{cinema.address}</p>
        </div>
        {cinema.distance !== null && (
          <p className="text-sm text-muted-foreground">Distância: {cinema.distance?.toFixed(1)} km</p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {cinema.roomTypes.map((type) => (
            <Badge key={type} variant="outline" className="text-xs">
              {type}
            </Badge>
          ))}
        </div>
        <div className="mt-3">
          <Button asChild size="sm">
            <a href={`/cinemas/${cinema.id}`}>Ver detalhes</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
