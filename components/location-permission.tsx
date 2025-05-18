"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MapPin } from "lucide-react"

export default function LocationPermission() {
  const { toast } = useToast()
  const [showDialog, setShowDialog] = useState(false)

  useEffect(() => {
    // Check if we've already asked for permission
    const hasAskedPermission = localStorage.getItem("locationPermissionAsked")
    const hasLocation = localStorage.getItem("userLocation")

    if (!hasAskedPermission && !hasLocation) {
      // Show the permission dialog
      setShowDialog(true)
      localStorage.setItem("locationPermissionAsked", "true")
    }
  }, [])

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      toast({
        title: "Obtendo sua localização",
        description: "Aguarde enquanto obtemos sua localização...",
      })

      navigator.geolocation.getCurrentPosition(
        // Success callback
        (position) => {
          const { latitude, longitude } = position.coords

          // Store coordinates for distance calculations
          localStorage.setItem("userCoordinates", JSON.stringify({ lat: latitude, lng: longitude }))

          // In a real app, we would use a reverse geocoding service to get the city name
          // For this demo, we'll just use a mock location based on coordinates
          let cityName = "Localização desconhecida"

          // Mock reverse geocoding based on approximate coordinates of Brazilian cities
          if (latitude > -24 && latitude < -23 && longitude > -47 && longitude < -46) {
            cityName = "São Paulo, SP"
          } else if (latitude > -23 && latitude < -22 && longitude > -44 && longitude < -43) {
            cityName = "Rio de Janeiro, RJ"
          } else if (latitude > -20 && latitude < -19 && longitude > -44.5 && longitude < -43.5) {
            cityName = "Belo Horizonte, MG"
          } else if (latitude > -16 && latitude < -15 && longitude > -48.5 && longitude < -47.5) {
            cityName = "Brasília, DF"
          }

          localStorage.setItem("userLocation", cityName)

          toast({
            title: "Localização obtida",
            description: `Mostrando cinemas próximos a ${cityName}`,
          })

          // Force a refresh to update UI with the new location
          window.location.reload()
        },
        // Error callback
        (error) => {
          console.error("Erro ao obter localização:", error)

          toast({
            variant: "destructive",
            title: "Erro ao obter localização",
            description: "Não foi possível obter sua localização. Mostrando todos os cinemas.",
          })

          // Set a default location
          localStorage.setItem("userLocation", "São Paulo, SP")
        },
        // Options
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    } else {
      toast({
        variant: "destructive",
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização. Mostrando todos os cinemas.",
      })

      // Set a default location
      localStorage.setItem("userLocation", "São Paulo, SP")
    }

    setShowDialog(false)
  }

  const handleDenyLocation = () => {
    toast({
      title: "Localização não compartilhada",
      description: "Mostrando todos os cinemas. Você pode buscar manualmente por cinema, filme ou shopping.",
    })

    // Set a default location
    localStorage.setItem("userLocation", "Localização não compartilhada")
    setShowDialog(false)
  }

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Compartilhar localização
          </AlertDialogTitle>
          <AlertDialogDescription>
            Gostaríamos de acessar sua localização para mostrar os cinemas mais próximos de você. Isso tornará sua
            experiência mais personalizada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDenyLocation}>Não, obrigado</AlertDialogCancel>
          <AlertDialogAction onClick={handleAllowLocation}>Permitir acesso</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
