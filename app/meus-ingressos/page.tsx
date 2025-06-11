"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Download, Film, MapPin, QrCode, Ticket, X } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockTickets, mockMovies } from "@/lib/mock-data"
import type { Ticket as TicketType } from "@/lib/types"
import QRCode from "react-qr-code"

export default function MyTicketsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [tickets, setTickets] = useState<TicketType[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null)
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
      })
      router.push("/login")
      return
    }

    if (user) {
      // In a real app, this would fetch tickets from an API
      const userTickets = mockTickets.filter((ticket) => ticket.userId === user.id)
      setTickets(userTickets)

      // Add a mock ticket for demo purposes if there are none
      if (userTickets.length === 0) {
        const mockTicket: TicketType = {
          id: "demo-1",
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
          qrCode:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
          purchaseDate: "15/05/2024",
          userId: user.id,
        }
        setTickets([mockTicket])
      }
    }
  }, [user, isLoading, router, toast])

  const handleShowQrCode = (ticket: TicketType) => {
    setSelectedTicket(ticket)
    setIsQrCodeModalOpen(true)
  }

  const handleDownloadTicket = (ticket: TicketType) => {
    // Open the ticket view page in a new tab for download/print
    const ticketUrl = `/ingresso/${ticket.id}`
    window.open(ticketUrl, "_blank")

    toast({
      title: "Ingresso aberto",
      description: "Uma nova aba foi aberta com seu ingresso. Você pode visualizar, imprimir ou salvar como PDF.",
    })
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Meus Ingressos</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus ingressos e acompanhe suas compras</p>
        </div>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="active">Ativos</TabsTrigger>
          <TabsTrigger value="past">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => {
                const movie = mockMovies.find((m) => m.title === ticket.movieTitle)
                return (
                  <Card key={ticket.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={movie?.backdropUrl || "/placeholder.svg?height=300&width=600"}
                        alt={ticket.movieTitle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-lg">{ticket.movieTitle}</h3>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {ticket.date} às {ticket.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{ticket.cinemaName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Film className="h-4 w-4 text-muted-foreground" />
                          <span>{ticket.roomName}</span>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-2">Assentos:</div>
                          <div className="flex flex-wrap gap-2">
                            {ticket.seats.map((seat, index) => (
                              <Badge key={index} variant="outline">
                                {seat.row}
                                {seat.number}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between gap-4 px-6 pb-6">
                      <Button variant="outline" className="flex-1" onClick={() => handleShowQrCode(ticket)}>
                        <QrCode className="h-4 w-4 mr-2" />
                        QR Code
                      </Button>
                      <Button className="flex-1" onClick={() => handleDownloadTicket(ticket)}>
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum ingresso ativo</h3>
              <p className="text-muted-foreground mb-6">Você não possui ingressos ativos no momento.</p>
              <Button asChild>
                <Link href="/em-cartaz">Ver filmes em cartaz</Link>
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          <div className="text-center py-12">
            <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Histórico de ingressos</h3>
            <p className="text-muted-foreground mb-6">Seu histórico de ingressos aparecerá aqui.</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* QR Code Modal */}
      {isQrCodeModalOpen && selectedTicket && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsQrCodeModalOpen(false)}
        >
          <div className="relative bg-card rounded-lg p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="absolute top-4 right-4">
              <Button variant="ghost" size="icon" onClick={() => setIsQrCodeModalOpen(false)}>
                <span className="sr-only">Fechar</span>
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold">{selectedTicket.movieTitle}</h3>
              <p className="text-muted-foreground">
                {selectedTicket.date} às {selectedTicket.time} • {selectedTicket.cinemaName}
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  value={`${window.location.origin}/ingresso/${selectedTicket.id}`}
                  size={192}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sala:</span>
                <span>{selectedTicket.roomName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assentos:</span>
                <span>{selectedTicket.seats.map((seat) => `${seat.row}${seat.number}`).join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="capitalize">{selectedTicket.ticketType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Código:</span>
                <span>{selectedTicket.id}</span>
              </div>
            </div>

            <div className="mt-6">
              <Button className="w-full" onClick={() => handleDownloadTicket(selectedTicket)}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Ingresso
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
