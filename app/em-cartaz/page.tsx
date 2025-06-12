"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal } from "lucide-react"
import MovieCard from "@/components/movie-card"
import { useData } from "@/lib/contexts/data-context"

export default function EmCartazPage() {
  const { movies } = useData()
  const [filteredMovies, setFilteredMovies] = useState(movies.filter((movie) => !movie.isComingSoon))
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popularity")
  const [genreFilter, setGenreFilter] = useState("all")

  // Get unique genres from all movies
  const allGenres = Array.from(new Set(movies.filter((movie) => !movie.isComingSoon).flatMap((movie) => movie.genres)))

  // Filter and sort movies
  useEffect(() => {
    let result = movies.filter((movie) => !movie.isComingSoon)

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (movie) =>
          movie.title.toLowerCase().includes(query) ||
          (movie.director && movie.director.toLowerCase().includes(query)) ||
          (movie.cast && movie.cast.some((actor) => actor && actor.toLowerCase().includes(query))),
      )
    }

    // Apply genre filter
    if (genreFilter !== "all") {
      result = result.filter((movie) => movie.genres.includes(genreFilter))
    }

    // Apply sorting
    if (sortBy === "popularity") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title))
    } else if (sortBy === "releaseDate") {
      result.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    }

    setFilteredMovies(result)
  }, [movies, searchQuery, sortBy, genreFilter])

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Filmes em Cartaz</h1>
          <p className="text-muted-foreground mt-1">Os melhores filmes nos cinemas agora</p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, diretor ou ator..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os gêneros</SelectItem>
              {allGenres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularidade</SelectItem>
              <SelectItem value="title">Título</SelectItem>
              <SelectItem value="releaseDate">Data de lançamento</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Nenhum filme encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar seus filtros ou buscar por outro termo.</p>
        </div>
      )}
    </div>
  )
}
