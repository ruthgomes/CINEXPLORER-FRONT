"use client"

import { useEffect, useState } from "react"
import { mockCinemas } from "@/lib/mock-data"
import CinemaCard from "@/components/cinema-card"
import type { Cinema } from "@/lib/types"

// Função para calcular distância entre duas coordenadas (fórmula de Haversine)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function CinemasPage() {
  const [filteredCinemas, setFilteredCinemas] = useState<(Cinema & { distance?: number })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userCoordinates = localStorage.getItem("userCoordinates")
    const locationShared = localStorage.getItem("locationShared")

    if (locationShared === "true" && userCoordinates) {
      const coords = JSON.parse(userCoordinates)

      // Calcular distância e ordenar cinemas
      const cinemasWithDistance = mockCinemas
        .map((cinema) => ({
          ...cinema,
          distance: cinema.location
            ? calculateDistance(coords.lat, coords.lng, cinema.location.lat, cinema.location.lng)
            : undefined,
        }))
        .sort((a, b) => (a.distance || 0) - (b.distance || 0))

      setFilteredCinemas(cinemasWithDistance)
    } else {
      // Mostrar todos os cinemas se localização não foi compartilhada
      setFilteredCinemas(mockCinemas)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando cinemas...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Nossos Cinemas</h1>
        <p className="text-muted-foreground">
          Encontre o cinema mais próximo de você e desfrute da melhor experiência cinematográfica
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCinemas.map((cinema) => (
          <div key={cinema.id} className="relative">
            <CinemaCard cinema={cinema} />
            {cinema.distance && (
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-full">
                {cinema.distance.toFixed(1)} km
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCinemas.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum cinema encontrado.</p>
        </div>
      )}
    </div>
  )
}
