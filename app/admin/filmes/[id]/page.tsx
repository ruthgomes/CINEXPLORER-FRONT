"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockMovies } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"

export default function AdminMovieEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [movie, setMovie] = useState<Movie | null>(null)

  // All available genres
  const allGenres = [
    "Ação",
    "Aventura",
    "Animação",
    "Biografia",
    "Comédia",
    "Crime",
    "Documentário",
    "Drama",
    "Família",
    "Fantasia",
    "Ficção Científica",
    "História",
    "Terror",
    "Musical",
    "Mistério",
    "Romance",
    "Suspense",
    "Guerra",
    "Faroeste",
  ]

  // All available classifications
  const allClassifications = ["Livre", "10 anos", "12 anos", "14 anos", "16 anos", "18 anos"]

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

    // Load movie data
    if (id === "novo") {
      // Creating a new movie
      setMovie({
        id: `new-${Date.now()}`,
        title: "",
        synopsis: "",
        posterUrl: "/placeholder.svg?height=450&width=300",
        backdropUrl: "/placeholder.svg?height=1080&width=1920",
        trailerUrl: "",
        duration: 120,
        releaseDate: new Date().toLocaleDateString("pt-BR"),
        classification: "14 anos",
        genres: ["Ação"],
        rating: 0,
        isComingSoon: false,
      })
      setIsLoading(false)
    } else {
      // Editing an existing movie
      const foundMovie = mockMovies.find((m) => m.id === id)
      if (foundMovie) {
        setMovie(foundMovie)
      } else {
        toast({
          variant: "destructive",
          title: "Filme não encontrado",
          description: "O filme que você está tentando editar não foi encontrado.",
        })
        router.push("/admin/filmes")
      }
      setIsLoading(false)
    }
  }, [id, user, authLoading, router, toast])

  const handleInputChange = (field: keyof Movie, value: any) => {
    if (movie) {
      setMovie({ ...movie, [field]: value })
    }
  }

  const handleGenreToggle = (genre: string) => {
    if (!movie) return

    const updatedGenres = movie.genres.includes(genre)
      ? movie.genres.filter((g) => g !== genre)
      : [...movie.genres, genre]

    setMovie({ ...movie, genres: updatedGenres })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Validate form
    if (!movie?.title) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "O título do filme é obrigatório.",
      })
      setIsSaving(false)
      return
    }

    if (!movie.synopsis) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "A sinopse do filme é obrigatória.",
      })
      setIsSaving(false)
      return
    }

    if (movie.genres.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Selecione pelo menos um gênero.",
      })
      setIsSaving(false)
      return
    }

    // In a real app, this would call an API to save the movie
    setTimeout(() => {
      toast({
        title: "Filme salvo",
        description: `O filme "${movie.title}" foi salvo com sucesso.`,
      })
      setIsSaving(false)
      router.push("/admin/filmes")
    }, 1000)
  }

  if (authLoading || isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Filme não encontrado</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/filmes")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {id === "novo" ? "Adicionar Filme" : `Editar Filme: ${movie.title}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {id === "novo" ? "Preencha os dados para adicionar um novo filme" : "Edite os dados do filme"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={movie.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Título do filme"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea
                id="synopsis"
                value={movie.synopsis}
                onChange={(e) => handleInputChange("synopsis", e.target.value)}
                placeholder="Sinopse do filme"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Duração (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={movie.duration}
                  onChange={(e) => handleInputChange("duration", Number.parseInt(e.target.value))}
                  min={1}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="releaseDate">Data de Estreia</Label>
                <Input
                  id="releaseDate"
                  value={movie.releaseDate}
                  onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                  placeholder="DD/MM/AAAA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="classification">Classificação</Label>
                <Select
                  value={movie.classification}
                  onValueChange={(value) => handleInputChange("classification", value)}
                >
                  <SelectTrigger id="classification">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {allClassifications.map((classification) => (
                      <SelectItem key={classification} value={classification}>
                        {classification}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Avaliação</Label>
                <Input
                  id="rating"
                  type="number"
                  value={movie.rating}
                  onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value))}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isComingSoon"
                checked={movie.isComingSoon}
                onCheckedChange={(checked) => handleInputChange("isComingSoon", checked)}
              />
              <Label htmlFor="isComingSoon">Em breve (não está em cartaz ainda)</Label>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="posterUrl">URL do Poster</Label>
              <Input
                id="posterUrl"
                value={movie.posterUrl}
                onChange={(e) => handleInputChange("posterUrl", e.target.value)}
                placeholder="https://exemplo.com/poster.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="backdropUrl">URL da Imagem de Fundo</Label>
              <Input
                id="backdropUrl"
                value={movie.backdropUrl}
                onChange={(e) => handleInputChange("backdropUrl", e.target.value)}
                placeholder="https://exemplo.com/backdrop.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trailerUrl">URL do Trailer</Label>
              <Input
                id="trailerUrl"
                value={movie.trailerUrl}
                onChange={(e) => handleInputChange("trailerUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=exemplo"
              />
            </div>

            <div className="space-y-2">
              <Label>Gêneros</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {allGenres.map((genre) => (
                  <div key={genre} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre}`}
                      checked={movie.genres.includes(genre)}
                      onCheckedChange={() => handleGenreToggle(genre)}
                    />
                    <Label htmlFor={`genre-${genre}`} className="text-sm font-normal">
                      {genre}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/filmes")}>
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
                Salvar Filme
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
