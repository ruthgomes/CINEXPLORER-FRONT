"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Phone, Star } from "lucide-react"
import { mockCinemas, mockMovies, mockSessions, mockRooms } from "@/lib/mock-data"
import type { Cinema, Movie, Session, Room } from "@/lib/types"

export default function CinemaDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [activeTab, setActiveTab] = useState("info")

  useEffect(() => {
    // Find the cinema by ID
    const foundCinema = mockCinemas.find((c) => c.id === id)
    if (foundCinema) {
      setCinema(foundCinema)

      // Find rooms for this cinema
      const cinemaRooms = mockRooms.filter((r) => r.cinemaId === id)
      setRooms(cinemaRooms)

      // Find sessions for this cinema
      const cinemaSessions = mockSessions.filter((s) => s.cinemaId === id)
      setSessions(cinemaSessions)
    } else {
      // Cinema not found, redirect to cinemas page
      router.push("/cinemas")
    }
  }, [id, router])

  if (!cinema) {
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

  // Group sessions by movie and date
  const sessionsByMovie = sessions.reduce(
    (acc, session) => {
      if (session.date !== selectedDate) return acc

      const movie = mockMovies.find((m) => m.id === session.movieId)
      if (!movie) return acc

      if (!acc[movie.id]) {
        acc[movie.id] = {
          movie,
          sessions: [],
        }
      }

      acc[movie.id].sessions.push(session)
      return acc
    },
    {} as Record<string, { movie: Movie; sessions: Session[] }>,
  )

  return (
    <div className="container py-8 md:py-12">
      <Link href="/cinemas" className="text-primary hover:underline mb-4 inline-block">
        ← Voltar para cinemas
      </Link>

      <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-6">
        <Image
          src={cinema.imageUrl || "/placeholder.svg?height=300&width=1200"}
          alt={cinema.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-3xl font-bold tracking-tight">{cinema.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{cinema.rating}</span>
              <span className="text-xs text-muted-foreground">({cinema.reviewCount} avaliações)</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="flex flex-wrap gap-1">
              {cinema.roomTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="sessions">Sessões</TabsTrigger>
              <TabsTrigger value="facilities">Instalações</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Endereço</h3>
                    <p className="text-muted-foreground">{cinema.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Telefone</h3>
                    <p className="text-muted-foreground">(11) 4002-8922</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">Horário de Funcionamento</h3>
                    <p className="text-muted-foreground">Segunda a Sexta: 13h às 22h</p>
                    <p className="text-muted-foreground">Sábados, Domingos e Feriados: 11h às 23h</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Localização no Mapa</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Em um ambiente de produção, aqui seria exibido um mapa interativo com a localização do cinema.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sessions" className="space-y-6">
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

              {Object.keys(sessionsByMovie).length > 0 ? (
                <div className="space-y-8">
                  {Object.values(sessionsByMovie).map(({ movie, sessions }) => (
                    <div key={movie.id} className="border rounded-lg p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative h-32 w-20 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
                            alt={movie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{movie.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 my-2">
                            <Badge variant="outline" className="text-xs">
                              {movie.classification}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{movie.duration} min</span>
                            {movie.genres.slice(0, 3).map((genre) => (
                              <Badge key={genre} variant="outline" className="text-xs">
                                {genre}
                              </Badge>
                            ))}
                          </div>
                          <Link href={`/filmes/${movie.id}`} className="text-primary text-sm hover:underline">
                            Ver detalhes do filme
                          </Link>
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
                    Não há sessões disponíveis para este cinema na data selecionada.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="facilities" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Salas</h3>
                    <div className="space-y-4">
                      {rooms.map((room) => (
                        <div key={room.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{room.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {room.totalSeats} assentos • {room.type}
                            </p>
                          </div>
                          <Badge variant="outline">{room.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Comodidades</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Estacionamento</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Bomboniere</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Acessibilidade para cadeirantes</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Wi-Fi gratuito</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Ar-condicionado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Filmes em Cartaz</h3>
              <div className="space-y-4">
                {Object.values(sessionsByMovie)
                  .slice(0, 5)
                  .map(({ movie }) => (
                    <Link
                      key={movie.id}
                      href={`/filmes/${movie.id}/ingressos?cinema=${cinema.id}`}
                      className="flex gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                    >
                      <div className="relative h-16 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
                          alt={movie.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium line-clamp-1">{movie.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {movie.classification} • {movie.duration} min
                        </p>
                        <div className="flex gap-1 mt-1">
                          {sessions
                            .filter((s) => s.movieId === movie.id && s.date === selectedDate)
                            .slice(0, 3)
                            .map((session) => (
                              <Badge key={session.id} variant="outline" className="text-xs">
                                {session.time}
                              </Badge>
                            ))}
                          {sessions.filter((s) => s.movieId === movie.id && s.date === selectedDate).length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{sessions.filter((s) => s.movieId === movie.id && s.date === selectedDate).length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href={`/em-cartaz?cinema=${cinema.id}`}>Ver todos os filmes</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Promoções</h3>
              <div className="space-y-3">
                <Link
                  href="/promocoes/terca-do-cinema"
                  className="flex gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Terça do Cinema</h4>
                    <p className="text-xs text-muted-foreground">Todos os ingressos pela metade do preço</p>
                  </div>
                </Link>
                <Link
                  href="/promocoes/combo-familia"
                  className="flex gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Combo Família</h4>
                    <p className="text-xs text-muted-foreground">4 ingressos + 2 pipocas + 4 refrigerantes</p>
                  </div>
                </Link>
                <Link
                  href="/promocoes/desconto-estudante"
                  className="flex gap-3 hover:bg-muted p-2 rounded-md transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Desconto Estudante</h4>
                    <p className="text-xs text-muted-foreground">50% de desconto com carteirinha válida</p>
                  </div>
                </Link>
              </div>
              <Button asChild variant="outline" className="w-full mt-4">
                <Link href="/promocoes">Ver todas as promoções</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Check(props: React.SVGProps<SVGSVGElement>) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
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

function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
