"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockCinemas } from "@/lib/mock-data"
import type { Cinema } from "@/lib/types"

export default function AdminCinemaEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [cinema, setCinema] = useState<Cinema | null>(null)

  // All available room types
  const allRoomTypes = ["2D", "3D", "IMAX", "4DX", "VIP", "DBOX", "SCREENX"]

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
      })
      router.push("/")
      return
    }

    // Load cinema data
    if (id === "novo") {
      // Creating a new cinema
      setCinema({
        id: `new-${Date.now()}`,
        name: "",
        address: "",
        imageUrl: "/placeholder.svg?height=300&width=600",
        roomTypes: ["2D"],
        rating: 0,
        reviewCount: 0,
        location: {
          lat: -23.5505,
          lng: -46.6333,
        },
      })
      setIsLoading(false)
    } else {
      // Editing an existing cinema
      const foundCinema = mockCinemas.find((c) => c.id === id)
      if (foundCinema) {
        setCinema(foundCinema)
      } else {
        toast({
          variant: "destructive",
          title: "Cinema não encontrado",
          description: "O cinema que você está tentando editar não foi encontrado.",
        })
        router.push("/admin/cinemas")
      }
      setIsLoading(false)
    }
  }, [id, user, authLoading, router, toast])

  const handleInputChange = (field: keyof Cinema, value: any) => {
    if (cinema) {
      setCinema({ ...cinema, [field]: value })
    }
  }

  const handleRoomTypeToggle = (type: string) => {
    if (!cinema) return

    const updatedRoomTypes = cinema.roomTypes.includes(type)
      ? cinema.roomTypes.filter((t) => t !== type)
      : [...cinema.roomTypes, type]

    setCinema({ ...cinema, roomTypes: updatedRoomTypes })
  }

  const handleLocationChange = (field: "lat" | "lng", value: number) => {
    if (!cinema) return

    setCinema({
      ...cinema,
      location: {
        ...cinema.location!,
        [field]: value,
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Validate form
    if (!cinema?.name) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "O nome do cinema é obrigatório.",
      })
      setIsSaving(false)
      return
    }

    if (!cinema.address) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "O endereço do cinema é obrigatório.",
      })
      setIsSaving(false)
      return
    }

    if (cinema.roomTypes.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Selecione pelo menos um tipo de sala.",
      })
      setIsSaving(false)
      return
    }

    // In a real app, this would call an API to save the cinema
    setTimeout(() => {
      toast({
        title: "Cinema salvo",
        description: `O cinema "${cinema.name}" foi salvo com sucesso.`,
      })
      setIsSaving(false)
      router.push("/admin/cinemas")
    }, 1000)
  }

  if (authLoading || isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!cinema) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Cinema não encontrado</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/cinemas")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id === "novo" ? "Adicionar Cinema" : `Editar Cinema: ${cinema.name}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {id === "novo" ? "Preencha os dados para adicionar um novo cinema" : "Edite os dados do cinema"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={cinema.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nome do cinema"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Textarea
                id="address"
                value={cinema.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Endereço completo do cinema"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                value={cinema.imageUrl}
                onChange={(e) => handleInputChange("imageUrl", e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação</Label>
                <Input
                  id="rating"
                  type="number"
                  value={cinema.rating}
                  onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value))}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewCount">Número de Avaliações</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  value={cinema.reviewCount}
                  onChange={(e) => handleInputChange("reviewCount", Number.parseInt(e.target.value))}
                  min={0}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Tipos de Sala</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {allRoomTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`roomType-${type}`}
                      checked={cinema.roomTypes.includes(type)}
                      onCheckedChange={() => handleRoomTypeToggle(type)}
                    />
                    <Label htmlFor={`roomType-${type}`} className="text-sm font-normal">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Localização no Mapa</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={cinema.location?.lat || 0}
                    onChange={(e) => handleLocationChange("lat", Number.parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={cinema.location?.lng || 0}
                    onChange={(e) => handleLocationChange("lng", Number.parseFloat(e.target.value))}
                    step="0.0001"
                  />
                </div>
              </div>
              <div className="mt-4 bg-muted h-40 rounded-md flex items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Visualização do mapa estaria disponível aqui em um ambiente de produção
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/cinemas")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Cinema
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
