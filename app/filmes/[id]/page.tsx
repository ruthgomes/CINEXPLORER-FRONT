"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, Film, MapPin, Play, Star, Ticket } from "lucide-react"
import { mockMovies, mockCinemas, mockSessions } from "@/lib/mock-data"
import type { Movie, Session } from "@/lib/types"
import MovieCard from "@/components/movie-card"

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([])
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)

  useEffect(() => {
    // Find the movie by ID
    const foundMovie = mockMovies.find((m) => m.id === id)
    if (foundMovie) {
      setMovie(foundMovie)

      // Find similar movies (same genre)
      const similar = mockMovies
        .filter((m) => m.id !== id && m.genres.some((g) => foundMovie.genres.includes(g)))
        .slice(0, 4)
      setSimilarMovies(similar)

      // Find sessions for this movie
      const movieSessions = mockSessions.filter((s) => s.movieId === id)
      setSessions(movieSessions)
    }
  }, [id])

  if (!movie) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Group sessions by cinema
  const sessionsByCinema = sessions.reduce(
    (acc, session) => {
      const cinema = mockCinemas.find((c) => c.id === session.cinemaId)
      if (!cinema) return acc

      if (!acc[cinema.id]) {
        acc[cinema.id] = {
          cinema,
          sessions: [],
        }
      }

      acc[cinema.id].sessions.push(session)
      return acc
    },
    {} as Record<string, { cinema: (typeof mockCinemas)[0]; sessions: Session[] }>,
  )

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" }).replace(".", ""),
    }
  })

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[60vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={movie.backdropUrl || "/placeholder.svg?height=1080&width=1920"}
            alt={movie.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        </div>

        <div className="container relative h-full flex items-end pb-12 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="hidden md:block relative h-[300px] w-[200px] shadow-xl rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">{movie.title}</h1>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{movie.duration} min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  <span>Estreia: {movie.releaseDate}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {movie.classification}
                </Badge>
                {movie.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs">
                    {genre}
                  </Badge>
                ))}
                {movie.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span>{movie.rating}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href={`/filmes/${movie.id}/ingressos`}>
                    <Ticket className="mr-2 h-4 w-4" />
                    Comprar Ingressos
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2" onClick={() => setIsTrailerOpen(true)}>
                  <Play className="h-4 w-4" />
                  Ver Trailer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-black">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="info">Informações</TabsTrigger>
                  <TabsTrigger value="sessions">Sessões</TabsTrigger>
                  <TabsTrigger value="reviews">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Sinopse</h2>
                    <p className="text-muted-foreground">{movie.synopsis}</p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Detalhes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Título Original:</span>
                          <span>{movie.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duração:</span>
                          <span>{movie.duration} minutos</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Classificação:</span>
                          <span>{movie.classification}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Estreia:</span>
                          <span>{movie.releaseDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Gêneros:</span>
                          <span>{movie.genres.join(", ")}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Avaliação:</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            <span>{movie.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sessions">
                  <div className="space-y-6">
                    <div className="flex overflow-x-auto pb-2 gap-2">
                      {dates.map((date) => (
                        <Button
                          key={date.value}
                          variant={selectedDate === date.value ? "default" : "outline"}
                          className="flex-shrink-0"
                          onClick={() => setSelectedDate(date.value)}
                        >
                          {date.label}
                        </Button>
                      ))}
                    </div>

                    {Object.values(sessionsByCinema).length > 0 ? (
                      <div className="space-y-6">
                        {Object.values(sessionsByCinema).map(({ cinema, sessions }) => (
                          <Card key={cinema.id} className="bg-card/50">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-bold">{cinema.name}</h3>
                                  <div className="flex items-start gap-2 mt-1">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-muted-foreground">{cinema.address}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="font-medium">{cinema.rating}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sessions.map((session) => (
                                  <div
                                    key={session.id}
                                    className="flex items-center justify-between p-3 border rounded-md"
                                  >
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <Badge>{session.roomType}</Badge>
                                        <span className="text-sm">{session.roomName}</span>
                                      </div>
                                      <div className="mt-1 text-lg font-semibold">{session.time}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm text-muted-foreground mb-1">A partir de</div>
                                      <div className="text-lg font-bold">
                                        R$ {session.price.toFixed(2).replace(".", ",")}
                                      </div>
                                      <Button asChild size="sm" className="mt-2">
                                        <Link href={`/sessoes/${session.id}/assentos`}>Comprar</Link>
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Nenhuma sessão disponível</h3>
                        <p className="text-muted-foreground">
                          Não há sessões disponíveis para este filme na data selecionada.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="text-center py-12">
                    <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Avaliações em breve</h3>
                    <p className="text-muted-foreground">As avaliações para este filme estarão disponíveis em breve.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Filmes Similares</h2>
              <div className="grid grid-cols-2 gap-4">
                {similarMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsTrailerOpen(false)}
        >
          <div className="relative w-full max-w-4xl mx-4 aspect-video" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => setIsTrailerOpen(false)}>
                <span className="sr-only">Fechar</span>
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
                  className="h-6 w-6"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="w-full h-full bg-black flex items-center justify-center">
              <p className="text-center text-muted-foreground">
                Trailer não disponível. Em um ambiente real, o trailer seria exibido aqui.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
