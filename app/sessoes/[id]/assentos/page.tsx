"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Clock, Info, Ticket, X } from "lucide-react"
import { mockMovies, mockCinemas, mockSessions, mockRooms, generateMockSeats } from "@/lib/mock-data"
import type { Session, Seat, Movie, Cinema, Room } from "@/lib/types"
// Primeiro, vamos importar o hook useAuth para verificar se o usuário está logado
import { useAuth } from "@/components/auth-provider"

// Modificar a função do componente para incluir o hook useAuth
export default function SeatsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth() // Adicionar o hook useAuth
  const [session, setSession] = useState<Session | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [cinema, setCinema] = useState<Cinema | null>(null)
  const [room, setRoom] = useState<Room | null>(null)
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [ticketTypes, setTicketTypes] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    // Find session by ID
    const foundSession = mockSessions.find((s) => s.id === id)
    if (foundSession) {
      setSession(foundSession)

      // Find related data
      const foundMovie = mockMovies.find((m) => m.id === foundSession.movieId)
      const foundCinema = mockCinemas.find((c) => c.id === foundSession.cinemaId)
      const foundRoom = mockRooms.find((r) => r.id === foundSession.roomId)

      if (foundMovie) setMovie(foundMovie)
      if (foundCinema) setCinema(foundCinema)
      if (foundRoom) {
        setRoom(foundRoom)
        // Generate mock seats
        const generatedSeats = generateMockSeats(foundSession.id, foundRoom.rows, foundRoom.seatsPerRow)
        setSeats(generatedSeats)
      }
    }
  }, [id])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied") return

    const isSelected = selectedSeats.some((s) => s.id === seat.id)

    if (isSelected) {
      // Remove seat and its ticket type
      setSelectedSeats(selectedSeats.filter((s) => s.id === seat.id))
      const newTicketTypes = { ...ticketTypes }
      delete newTicketTypes[seat.id]
      setTicketTypes(newTicketTypes)
    } else {
      // Add seat with default ticket type
      setSelectedSeats([...selectedSeats, seat])
      setTicketTypes({ ...ticketTypes, [seat.id]: "inteira" })
    }
  }

  const handleTicketTypeChange = (seatId: string, type: string) => {
    setTicketTypes({ ...ticketTypes, [seatId]: type })
  }

  const calculateTotal = () => {
    if (!session) return 0

    return selectedSeats.reduce((total, seat) => {
      const ticketType = ticketTypes[seat.id] || "inteira"
      const price = session.price * (ticketType === "meia" ? 0.5 : 1)
      return total + price
    }, 0)
  }

  // Modificar a função handleCheckout para verificar login e redirecionar para pagamento
  const handleCheckout = () => {
    if (selectedSeats.length === 0) {
      toast({
        variant: "destructive",
        title: "Nenhum assento selecionado",
        description: "Por favor, selecione pelo menos um assento para continuar.",
      })
      return
    }

    if (Object.keys(ticketTypes).length !== selectedSeats.length) {
      toast({
        variant: "destructive",
        title: "Tipo de ingresso não selecionado",
        description: "Por favor, selecione o tipo de ingresso para todos os assentos.",
      })
      return
    }

    // Verificar se o usuário está logado
    if (!user) {
      // Salvar dados da seleção no localStorage para recuperar após login
      localStorage.setItem(
        "selectedSession",
        JSON.stringify({
          sessionId: id,
          selectedSeats: selectedSeats,
          ticketTypes: ticketTypes,
          totalPrice: calculateTotal(),
        }),
      )

      toast({
        title: "Login necessário",
        description: "Por favor, faça login para continuar com a compra.",
      })

      // Redirecionar para login com parâmetro de retorno
      router.push(`/login?returnTo=/sessoes/${id}/pagamento`)
      return
    }

    // Se estiver logado, redirecionar para a página de pagamento
    // Salvar dados da seleção no localStorage
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        sessionId: id,
        movieId: movie?.id,
        cinemaId: cinema?.id,
        selectedSeats: selectedSeats,
        ticketTypes: ticketTypes,
        totalPrice: calculateTotal(),
        movieTitle: movie?.title,
        cinemaName: cinema?.name,
        roomName: session?.roomName,
        date: session?.date,
        time: session?.time,
      }),
    )

    router.push(`/sessoes/${id}/pagamento`)
  }

  if (!session || !movie || !cinema || !room) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Group seats by row
  const seatsByRow = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) {
        acc[seat.row] = []
      }
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  return (
    <div className="container py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <Link href={`/filmes/${movie.id}`} className="flex items-center text-primary hover:underline mb-2">
              <X className="h-4 w-4 mr-1" />
              Voltar para o filme
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                <span>
                  {session.date.split("-").reverse().join("/")} às {session.time}
                </span>
              </div>
              <Badge>{session.roomType}</Badge>
              <span>
                {cinema.name} - {session.roomName}
              </span>
            </div>
          </div>

          <div className="mb-8">
            <div className="w-full h-8 cinema-screen mb-8 rounded-t-full"></div>

            <div className="flex justify-center mb-6">
              <div className="grid grid-cols-3 gap-8">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-gray-700"></div>
                  <span className="text-sm">Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-primary"></div>
                  <span className="text-sm">Selecionado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-sm bg-gray-500"></div>
                  <span className="text-sm">Ocupado</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 overflow-x-auto pb-4">
              {Object.entries(seatsByRow).map(([row, rowSeats]) => (
                <div key={row} className="flex items-center gap-2">
                  <div className="w-6 text-center font-medium">{row}</div>
                  <div className="flex gap-2">
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.some((s) => s.id === seat.id)
                      return (
                        <button
                          key={seat.id}
                          className={`seat w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                            isSelected
                              ? "seat-selected"
                              : seat.status === "occupied"
                                ? "seat-occupied"
                                : "seat-available"
                          }`}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "occupied"}
                        >
                          {seat.number}
                        </button>
                      )
                    })}
                  </div>
                  <div className="w-6 text-center font-medium">{row}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo da compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-14 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{movie.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.roomType} - {session.roomName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {session.date.split("-").reverse().join("/")} às {session.time}
                  </p>
                  <p className="text-sm text-muted-foreground">{cinema.name}</p>
                </div>
              </div>

              <Separator />

              {selectedSeats.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold">Ingressos selecionados</h3>

                  {selectedSeats.map((seat) => (
                    <div key={seat.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-8 w-8 flex items-center justify-center p-0">
                          {seat.row}
                          {seat.number}
                        </Badge>
                        <Select
                          value={ticketTypes[seat.id] || "inteira"}
                          onValueChange={(value) => handleTicketTypeChange(seat.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inteira">Inteira</SelectItem>
                            <SelectItem value="meia">Meia</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R${" "}
                          {(ticketTypes[seat.id] === "meia" ? session.price * 0.5 : session.price)
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <p className="font-semibold">Total</p>
                    <p className="text-xl font-bold">R$ {calculateTotal().toFixed(2).replace(".", ",")}</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Ticket className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">Selecione os assentos para continuar</p>
                </div>
              )}

              <div className="flex items-start gap-2 p-3 bg-primary/10 rounded-md text-sm">
                <Info className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary">Informações importantes</p>
                  <p className="text-muted-foreground mt-1">
                    Meia-entrada: é necessário apresentar documento comprobatório na entrada do cinema.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" size="lg" disabled={selectedSeats.length === 0} onClick={handleCheckout}>
                Continuar para pagamento
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
