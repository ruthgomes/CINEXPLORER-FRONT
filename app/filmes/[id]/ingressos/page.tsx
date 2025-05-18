"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin } from "lucide-react"
import { mockMovies, mockCinemas, mockSessions } from "@/lib/mock-data"
import type { Movie, Cinema, Session } from "@/lib/types"

export default function MovieTicketsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [selectedCinemaId, setSelectedCinemaId] = useState<string | null>(null)

  useEffect(() => {
    // Find the movie by ID
    const foundMovie = mockMovies.find((m) => m.id === id)
    if (foundMovie) {
      setMovie(foundMovie)

      // Find sessions for this movie
      const movieSessions = mockSessions.filter((s) => s.movieId === id)
      setSessions(movieSessions)
    } else {
      // Movie not found, redirect to movies page
      router.push("/em-cartaz")
    }
  }, [id, router])

  if (!movie) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Generate dates for the next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" }).replace(".", ""),
    }
  })

  // Group sessions by cinema and date
  const sessionsByCinema = sessions.reduce(
    (acc, session) => {
      if (session.date !== selectedDate) return acc

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
    {} as Record<string, { cinema: Cinema; sessions: Session[] }>,
  )

  // Filter by selected cinema if any
  const filteredSessionsByCinema = selectedCinemaId
    ? Object.fromEntries(Object.entries(sessionsByCinema).filter(([cinemaId]) => cinemaId === selectedCinemaId))
    : sessionsByCinema

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8">
        <Link href={`/filmes/${movie.id}`} className="text-primary hover:underline mb-2 inline-block">
          ← Voltar para detalhes do filme
        </Link>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative h-[300px] w-[200px] shadow-xl rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>{movie.duration} min</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {movie.classification}
              </Badge>
              {movie.genres.map((genre) => (
                <Badge key={genre} variant="outline" className="text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
            <p className="text-muted-foreground mb-6 max-w-2xl">{movie.synopsis}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ingressos disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="byDate" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="byDate">Por Data</TabsTrigger>
              <TabsTrigger value="byCinema">Por Cinema</TabsTrigger>
            </TabsList>

            <TabsContent value="byDate" className="space-y-6">
              <div className="flex overflow-x-auto pb-2 gap-2">
                {dates.map((date) => (
                  <Button
                    key={date.value}
                    variant={selectedDate === date.value ? "default" : "outline"}
                    className="flex-shrink-0"
                    onClick={() => {
                      setSelectedDate(date.value)
                      setSelectedCinemaId(null)
                    }}
                  >
                    {date.label}
                  </Button>
                ))}
              </div>

              {Object.keys(filteredSessionsByCinema).length > 0 ? (
                <div className="space-y-8">
                  {Object.values(filteredSessionsByCinema).map(({ cinema, sessions }) => (
                    <div key={cinema.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{cinema.name}</h3>
                          <div className="flex items-start gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{cinema.address}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
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
                            className="h-4 w-4 text-yellow-400"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                          <span className="font-medium">{cinema.rating}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sessions
                          .sort((a, b) => {
                            const timeA = a.time.split(":").map(Number)
                            const timeB = b.time.split(":").map(Number)
                            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
                          })
                          .map((session) => (
                            <div key={session.id} className="border rounded-md p-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Badge>{session.roomType}</Badge>
                                <span className="text-sm">{session.roomName}</span>
                              </div>
                              <div className="text-lg font-semibold mb-2">{session.time}</div>
                              <div className="text-sm text-muted-foreground mb-3">
                                R$ {session.price.toFixed(2).replace(".", ",")}
                              </div>
                              <Button asChild size="sm" className="w-full">
                                <Link href={`/sessoes/${session.id}/assentos`}>Comprar</Link>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhuma sessão disponível</h3>
                  <p className="text-muted-foreground">
                    Não há sessões disponíveis para este filme na data selecionada.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="byCinema" className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {mockCinemas.map((cinema) => {
                  const hasSessions = sessions.some((s) => s.cinemaId === cinema.id && s.date === selectedDate)
                  return (
                    <Button
                      key={cinema.id}
                      variant={selectedCinemaId === cinema.id ? "default" : hasSessions ? "outline" : "ghost"}
                      className={`h-auto py-3 flex flex-col items-center justify-center text-center ${
                        !hasSessions && "opacity-50"
                      }`}
                      onClick={() => setSelectedCinemaId(hasSessions ? cinema.id : null)}
                      disabled={!hasSessions}
                    >
                      <span className="font-medium">{cinema.name}</span>
                      <span className="text-xs mt-1 text-muted-foreground">
                        {hasSessions
                          ? `${
                              sessions.filter((s) => s.cinemaId === cinema.id && s.date === selectedDate).length
                            } sessões`
                          : "Sem sessões"}
                      </span>
                    </Button>
                  )
                })}
              </div>

              {selectedCinemaId && Object.keys(filteredSessionsByCinema).length > 0 ? (
                <div className="space-y-8 mt-6">
                  {Object.values(filteredSessionsByCinema).map(({ cinema, sessions }) => (
                    <div key={cinema.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold">{cinema.name}</h3>
                          <div className="flex items-start gap-2 mt-1">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{cinema.address}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setSelectedCinemaId(null)}>
                          Limpar seleção
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {sessions
                          .sort((a, b) => {
                            const timeA = a.time.split(":").map(Number)
                            const timeB = b.time.split(":").map(Number)
                            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1])
                          })
                          .map((session) => (
                            <div key={session.id} className="border rounded-md p-3 text-center">
                              <div className="flex items-center justify-center gap-2 mb-2">
                                <Badge>{session.roomType}</Badge>
                                <span className="text-sm">{session.roomName}</span>
                              </div>
                              <div className="text-lg font-semibold mb-2">{session.time}</div>
                              <div className="text-sm text-muted-foreground mb-3">
                                R$ {session.price.toFixed(2).replace(".", ",")}
                              </div>
                              <Button asChild size="sm" className="w-full">
                                <Link href={`/sessoes/${session.id}/assentos`}>Comprar</Link>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedCinemaId ? (
                <div className="text-center py-12 border rounded-lg mt-6">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhuma sessão disponível</h3>
                  <p className="text-muted-foreground">
                    Não há sessões disponíveis para este filme no cinema e data selecionados.
                  </p>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
