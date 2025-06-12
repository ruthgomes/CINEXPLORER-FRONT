"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, MapPin } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useData } from "@/lib/contexts/data-context"

export default function NewCinemaPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { addCinema } = useData()

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    imageUrl: "",
    roomTypes: [] as string[],
    rating: "",
    reviewCount: "",
    lat: "",
    lng: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableRoomTypes = ["2D", "3D", "IMAX", "4DX", "VIP", "Premium", "Dolby Atmos"]

  const handleRoomTypeChange = (roomType: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        roomTypes: [...prev.roomTypes, roomType],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        roomTypes: prev.roomTypes.filter((rt) => rt !== roomType),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || user.role !== "admin") {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para realizar esta ação.",
      })
      return
    }

    if (!formData.name || !formData.address) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addCinema({
        name: formData.name,
        address: formData.address,
        imageUrl: formData.imageUrl || "/placeholder.svg?height=300&width=400",
        roomTypes: formData.roomTypes.length > 0 ? formData.roomTypes : ["2D"],
        rating: formData.rating ? Number.parseFloat(formData.rating) : 4.5,
        reviewCount: formData.reviewCount ? Number.parseInt(formData.reviewCount) : 0,
        location:
          formData.lat && formData.lng
            ? {
                lat: Number.parseFloat(formData.lat),
                lng: Number.parseFloat(formData.lng),
              }
            : undefined,
      })

      toast({
        title: "Cinema adicionado",
        description: `O cinema "${formData.name}" foi adicionado com sucesso.`,
      })

      router.push("/admin/cinemas")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o cinema. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/cinemas">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adicionar Novo Cinema</h1>
          <p className="text-muted-foreground mt-1">Preencha as informações do cinema</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Informações do Cinema
          </CardTitle>
          <CardDescription>Preencha todos os campos obrigatórios para adicionar o cinema ao sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Cinema *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="CineXplorer Shopping Center"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">URL da Imagem</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://exemplo.com/cinema.jpg"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Rua das Flores, 123 - Centro, São Paulo - SP"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lat">Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lat: e.target.value }))}
                  placeholder="-23.5505"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lng">Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lng: e.target.value }))}
                  placeholder="-46.6333"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação (0-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  placeholder="4.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewCount">Número de Avaliações</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reviewCount: e.target.value }))}
                  placeholder="150"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tipos de Sala</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {availableRoomTypes.map((roomType) => (
                  <div key={roomType} className="flex items-center space-x-2">
                    <Checkbox
                      id={roomType}
                      checked={formData.roomTypes.includes(roomType)}
                      onCheckedChange={(checked) => handleRoomTypeChange(roomType, checked as boolean)}
                    />
                    <Label htmlFor={roomType} className="text-sm font-normal">
                      {roomType}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Cinema"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/cinemas">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
