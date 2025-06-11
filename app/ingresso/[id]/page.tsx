"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Film, Download, ArrowLeft } from "lucide-react"
import { mockTickets, mockMovies } from "@/lib/mock-data"
import type { Ticket as TicketType } from "@/lib/types"
import QRCode from "react-qr-code"

export default function TicketViewPage() {
  const params = useParams()
  const router = useRouter()
  const [ticket, setTicket] = useState<TicketType | null>(null)
  const [movie, setMovie] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const ticketId = params.id as string

    // Find the ticket by ID
    const foundTicket = mockTickets.find((t) => t.id === ticketId)

    if (!foundTicket) {
      // Create a demo ticket if not found
      const demoTicket: TicketType = {
        id: ticketId,
        sessionId: "1",
        movieTitle: "Duna: Parte 2",
        cinemaName: "CineMax Morumbi",
        roomName: "Sala 1 - IMAX",
        date: "17/05/2024",
        time: "14:30",
        seats: [
          { row: "F", number: 5 },
          { row: "F", number: 6 },
        ],
        ticketType: "inteira",
        price: 90.0,
        qrCode: "",
        purchaseDate: "15/05/2024",
        userId: "demo-user",
      }
      setTicket(demoTicket)
    } else {
      setTicket(foundTicket)
    }

    // Find the movie
    const foundMovie = mockMovies.find((m) => m.title === (foundTicket?.movieTitle || "Duna: Parte 2"))
    setMovie(foundMovie)

    setIsLoading(false)
  }, [params.id])

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF ticket
    console.log("Downloading ticket...")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando ingresso...</p>
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ingresso não encontrado</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="container max-w-2xl">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <Card className="overflow-hidden shadow-2xl">
          {/* Movie Header */}
          <div className="relative h-48 w-full">
            <Image
              src={movie?.backdropUrl || "/placeholder.svg?height=300&width=600"}
              alt={ticket.movieTitle}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="text-2xl font-bold text-white mb-2">{ticket.movieTitle}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{ticket.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{ticket.time}</span>
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Ticket Details */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Cinema</h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{ticket.cinemaName}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">Sala</h3>
                    <div className="flex items-center gap-2">
                      <Film className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{ticket.roomName}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Assentos
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ticket.seats.map((seat, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {seat.row}
                          {seat.number}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Tipo de Ingresso
                    </h3>
                    <Badge variant="outline" className="capitalize">
                      {ticket.ticketType}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Valor Total
                    </h3>
                    <span className="text-2xl font-bold text-green-600">R$ {ticket.price.toFixed(2)}</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                      Data da Compra
                    </h3>
                    <span className="font-medium">{ticket.purchaseDate}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* QR Code Section */}
              <div className="text-center space-y-4">
                <h3 className="font-semibold text-lg">Código de Validação</h3>
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-300">
                    <QRCode
                      value={`TICKET:${ticket.id}:${ticket.movieTitle}:${ticket.date}:${ticket.time}`}
                      size={200}
                      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Apresente este código QR na entrada do cinema para validar seu ingresso
                </p>
              </div>

              <Separator />

              {/* Ticket ID */}
              <div className="text-center">
                <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                  Código do Ingresso
                </h4>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">{ticket.id}</code>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t bg-gray-50 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Ingresso
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => router.push("/meus-ingressos")}>
                  Ver Todos os Ingressos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        <Card className="mt-6">
          <CardHeader>
            <h3 className="font-semibold">Informações Importantes</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Chegue com pelo menos 15 minutos de antecedência</p>
            <p>• Apresente um documento de identidade junto com o ingresso</p>
            <p>• Este ingresso é válido apenas para a sessão especificada</p>
            <p>• Não é permitida a troca ou devolução após a compra</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
