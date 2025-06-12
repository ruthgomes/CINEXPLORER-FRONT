"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Film } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { useData } from "@/lib/contexts/data-context"

export default function NewMoviePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const { addMovie } = useData()

  const [formData, setFormData] = useState({
    title: "",
    synopsis: "",
    posterUrl: "",
    backdropUrl: "",
    trailerUrl: "",
    duration: "",
    releaseDate: "",
    classification: "",
    genres: [] as string[],
    rating: "",
    isComingSoon: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const availableGenres = [
    "Ação",
    "Aventura",
    "Comédia",
    "Drama",
    "Ficção Científica",
    "Terror",
    "Romance",
    "Thriller",
    "Animação",
    "Documentário",
    "Fantasia",
    "Crime",
    "Mistério",
    "Guerra",
    "Musical",
  ]

  const classifications = ["L", "10", "12", "14", "16", "18"]

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setFormData((prev) => ({
        ...prev,
        genres: [...prev.genres, genre],
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        genres: prev.genres.filter((g) => g !== genre),
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

    if (!formData.title || !formData.synopsis || !formData.duration || !formData.releaseDate) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      addMovie({
        title: formData.title,
        synopsis: formData.synopsis,
        posterUrl: formData.posterUrl || "/placeholder.svg?height=600&width=400",
        backdropUrl: formData.backdropUrl || "/placeholder.svg?height=400&width=800",
        trailerUrl: formData.trailerUrl,
        duration: Number.parseInt(formData.duration),
        releaseDate: formData.releaseDate,
        classification: formData.classification,
        genres: formData.genres,
        rating: formData.rating ? Number.parseFloat(formData.rating) : undefined,
        isComingSoon: formData.isComingSoon,
      })

      toast({
        title: "Filme adicionado",
        description: `O filme "${formData.title}" foi adicionado com sucesso.`,
      })

      router.push("/admin/filmes")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o filme. Tente novamente.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/filmes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adicionar Novo Filme</h1>
          <p className="text-muted-foreground mt-1">Preencha as informações do filme</p>
        </div>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Informações do Filme
          </CardTitle>
          <CardDescription>Preencha todos os campos obrigatórios para adicionar o filme ao catálogo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Digite o título do filme"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (minutos) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="120"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Data de Estreia *</Label>
                <Input
                  id="releaseDate"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, releaseDate: e.target.value }))}
                  placeholder="01/01/2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="classification">Classificação</Label>
                <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, classification: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    {classifications.map((classification) => (
                      <SelectItem key={classification} value={classification}>
                        {classification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação (0-10)</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData((prev) => ({ ...prev, rating: e.target.value }))}
                  placeholder="8.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="posterUrl">URL do Poster</Label>
                <Input
                  id="posterUrl"
                  value={formData.posterUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, posterUrl: e.target.value }))}
                  placeholder="https://exemplo.com/poster.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backdropUrl">URL do Backdrop</Label>
                <Input
                  id="backdropUrl"
                  value={formData.backdropUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, backdropUrl: e.target.value }))}
                  placeholder="https://exemplo.com/backdrop.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerUrl">URL do Trailer</Label>
                <Input
                  id="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, trailerUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopse *</Label>
              <Textarea
                id="synopsis"
                value={formData.synopsis}
                onChange={(e) => setFormData((prev) => ({ ...prev, synopsis: e.target.value }))}
                placeholder="Digite a sinopse do filme"
                rows={4}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>Gêneros</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {availableGenres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={genre}
                      checked={formData.genres.includes(genre)}
                      onCheckedChange={(checked) => handleGenreChange(genre, checked as boolean)}
                    />
                    <Label htmlFor={genre} className="text-sm font-normal">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isComingSoon"
                checked={formData.isComingSoon}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isComingSoon: checked as boolean }))}
              />
              <Label htmlFor="isComingSoon">Este filme está em breve (não está em cartaz ainda)</Label>
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adicionando..." : "Adicionar Filme"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/admin/filmes">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
