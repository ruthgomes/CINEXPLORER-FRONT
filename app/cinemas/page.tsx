"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, SlidersHorizontal } from "lucide-react"
import CinemaCard from "@/components/cinema-card"
import { useData } from "@/lib/contexts/data-context"

export default function CinemasPage() {
  const { cinemas } = useData()
  const [filteredCinemas, setFilteredCinemas] = useState(cinemas)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("distance")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Get user location if they've shared it
  useEffect(() => {
    try {
      const storedLocation = localStorage.getItem("userLocation")
      if (storedLocation) {
        // Check if the stored value is valid JSON
        if (storedLocation.startsWith("{") && storedLocation.endsWith("}")) {
          const location = JSON.parse(storedLocation)
          // Validate that it has the expected structure
          if (location && typeof location.lat === "number" && typeof location.lng === "number") {
            setUserLocation(location)
          } else {
            // Invalid structure, remove it
            localStorage.removeItem("userLocation")
          }
        } else {
          // Not valid JSON, remove it
          localStorage.removeItem("userLocation")
        }
      }
    } catch (error) {
      console.error("Error parsing stored location:", error)
      // Remove invalid data
      localStorage.removeItem("userLocation")
    }
  }, [])

  // Filter and sort cinemas
  useEffect(() => {
    let result = [...cinemas]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (cinema) =>
          (cinema.name && cinema.name.toLowerCase().includes(query)) ||
          (cinema.address && cinema.address.toLowerCase().includes(query)) ||
          (cinema.city && cinema.city.toLowerCase().includes(query)),
      )
    }

    // Apply sorting
    if (sortBy === "distance" && userLocation) {
      result.sort((a, b) => {
        const distA = calculateDistance(userLocation, a.location)
        const distB = calculateDistance(userLocation, b.location)
        return distA - distB
      })
    } else if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    setFilteredCinemas(result)
  }, [cinemas, searchQuery, sortBy, userLocation])

  // Calculate distance between two points
  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in km
    const dLat = ((point2.lat - point1.lat) * Math.PI) / 180
    const dLng = ((point2.lng - point1.lng) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.lat * Math.PI) / 180) *
        Math.cos((point2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          try {
            localStorage.setItem("userLocation", JSON.stringify(location))
          } catch (error) {
            console.error("Error saving location:", error)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cinemas</h1>
          <p className="text-muted-foreground mt-1">Encontre o cinema mais próximo de você</p>
        </div>

        {!userLocation && (
          <Button variant="outline" className="flex items-center gap-2" onClick={handleLocationRequest}>
            <MapPin className="h-4 w-4" />
            Compartilhar localização
          </Button>
        )}
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, endereço ou cidade..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Distância</SelectItem>
              <SelectItem value="name">Nome</SelectItem>
              <SelectItem value="rating">Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCinemas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCinemas.map((cinema) => (
            <CinemaCard
              key={cinema.id}
              cinema={cinema}
              distance={userLocation ? calculateDistance(userLocation, cinema.location) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Nenhum cinema encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar seus filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  )
}
