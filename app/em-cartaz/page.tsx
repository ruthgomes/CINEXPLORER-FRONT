"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Grid, List, Search } from "lucide-react"
import MovieCard from "@/components/movie-card"
import { mockMovies } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"

export default function EmCartazPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [genreFilter, setGenreFilter] = useState<string>("todos")
  const [classificationFilter, setClassificationFilter] = useState<string>("todos")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all available genres from movies
  const allGenres = Array.from(new Set(mockMovies.flatMap((movie) => movie.genres)))

  // Get all available classifications from movies
  const allClassifications = Array.from(new Set(mockMovies.map((movie) => movie.classification)))

  // Filter movies that are not coming soon
  const currentMovies = mockMovies.filter((movie) => !movie.isComingSoon)

  // Apply filters
  const filteredMovies = currentMovies.filter((movie) => {
    // Search filter
    const matchesSearch =
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.synopsis.toLowerCase().includes(searchQuery.toLowerCase())

    // Genre filter
    const matchesGenre = genreFilter === "todos" || movie.genres.includes(genreFilter)

    // Classification filter
    const matchesClassification = classificationFilter === "todos" || movie.classification === classificationFilter

    return matchesSearch && matchesGenre && matchesClassification
  })

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Em Cartaz</h1>
          <p className="text-muted-foreground mt-1">Confira os filmes em exibição nos cinemas</p>
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
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-64 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar filmes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gênero</label>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os gêneros" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os gêneros</SelectItem>
                {allGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Classificação</label>
            <Select value={classificationFilter} onValueChange={setClassificationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as classificações" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas as classificações</SelectItem>
                {allClassifications.map((classification) => (
                  <SelectItem key={classification} value={classification}>
                    {classification}
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
              setGenreFilter("todos")
              setClassificationFilter("todos")
            }}
          >
            Limpar filtros
          </Button>
        </div>

        <div className="flex-1">
          {filteredMovies.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMovies.map((movie) => (
                  <MovieListItem key={movie.id} movie={movie} />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum filme encontrado</h3>
              <p className="text-muted-foreground">
                Não encontramos filmes que correspondam aos seus filtros. Tente ajustar os critérios de busca.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface MovieListItemProps {
  movie: Movie
}

function MovieListItem({ movie }: MovieListItemProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:bg-card/50 transition-colors">
      <div className="relative h-40 w-28 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
          alt={movie.title}
          className="object-cover w-full h-full"
        />
        {movie.rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
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
              className="h-3 w-3"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{movie.rating}</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{movie.title}</h3>
        <div className="flex flex-wrap gap-2 my-2">
          <Badge variant="outline" className="text-xs">
            {movie.classification}
          </Badge>
          {movie.genres.map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4" />
            <span>{movie.duration} min</span>
          </div>
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>Estreia: {movie.releaseDate}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{movie.synopsis}</p>
        <div className="mt-3">
          <Button asChild size="sm">
            <a href={`/filmes/${movie.id}`}>Ver detalhes</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
