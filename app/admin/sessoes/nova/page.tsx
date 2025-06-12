"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useData } from "@/lib/contexts/data-context"

export default function NewSessionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { movies, cinemas, addSession } = useData()

  const [formData, setFormData] = useState({
    movieId: "",
    cinemaId: "",
    roomName: "",
    roomType: "",
    date: "",
    time: "",
    price: "",
    totalSeats: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const roomTypes = ["2D", "3D", "IMAX", "4DX", "VIP", "Premium", "Dolby Atmos"]

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

    if (!formData.movieId || !formData.cinemaId || !formData.date || !formData.time || !formData.price) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const totalSeats = Number.parseInt(formData.totalSeats) || 100

      addSession({
        movieId: formData.movieId,
        cinemaId: formData.cinemaId,
        roomId: `room-${Date.now()}`,
        roomName: formData.roomName || "Sala 1",
        roomType: formData.roomType || "2D",
        date: formData.date,
        time: formData.time,
        price: Number.parseFloat(formData.price),
        availableSeats: totalSeats,
        totalSeats: totalSeats,
      })

      const movie = movies.find((m) => m.id === formData.movieId)
      const cinema = cinemas.find((c) => c.id === formData.cinemaId)

      toast({
        title: "Sessão adicionada",
        description: `A sessão de "${movie?.title}" no ${cinema?.name} foi adicionada com sucesso.`,
      })

      router.push("/admin/sessoes")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao adicionar a sessão. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/sessoes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adicionar Nova Sessão</h1>
          <p className="text-muted-foreground mt-1">Preencha as informações da sessão</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Informações da Sessão
          </CardTitle>
          <CardDescription>Preencha todos os campos obrigatórios para adicionar a sessão ao sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="movieId">Filme *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, movieId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o filme" />
                  </SelectTrigger>
                  <SelectContent>
                    {movies.map((movie) => (
                      <SelectItem key={movie.id} value={movie.id}>
                        {movie.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cinemaId">Cinema *</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, cinemaId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cinema" />
                  </SelectTrigger>
                  <SelectContent>
                    {cinemas.map((cinema) => (
                      <SelectItem key={cinema.id} value={cinema.id}>
                        {cinema.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Horário *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomName">Nome da Sala</Label>
                <Input
                  id="roomName"
                  value={formData.roomName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, roomName: e.target.value }))}
                  placeholder="Sala 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Tipo de Sala</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, roomType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  placeholder="25.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalSeats">Total de Assentos</Label>
                <Input
                  id="totalSeats"
                  type="number"
                  min="1"
                  value={formData.totalSeats}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalSeats: e.target.value }))}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Sessão"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/sessoes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
