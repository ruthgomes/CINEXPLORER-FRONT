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
import { useRouter } from "next/navigation"

export default function LocationPermission() {
  const { toast } = useToast()
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

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
    localStorage.setItem("locationShared", "true")

    toast({
      title: "Redirecionando",
      description: "Você será redirecionado para cadastrar seu endereço completo.",
    })

    setShowDialog(false)
    router.push("/cadastrar-endereco")
  }

  const handleDenyLocation = () => {
    localStorage.setItem("locationShared", "false")
    localStorage.setItem("userLocation", "Brasil")

    toast({
      title: "Localização não compartilhada",
      description: "Mostrando todos os cinemas do Brasil. Você pode buscar manualmente.",
    })

    setShowDialog(false)
    window.location.reload()
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
