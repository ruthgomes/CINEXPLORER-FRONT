"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockSessions, mockMovies, mockCinemas, mockRooms } from "@/lib/mock-data"
import type { Session } from "@/lib/types"

export default function AdminSessionEditPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const [selectedCinemaId, setSelectedCinemaId] = useState<string>("")

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

    // Load session data
    if (id === "nova") {
      // Creating a new session
      const newSession: Session = {
        id: `new-${Date.now()}`,
        movieId: "",
        cinemaId: "",
        roomId: "",
        roomName: "",
        roomType: "",
        date: new Date().toISOString().split("T")[0],
        time: "14:00",
        price: 30.0,
        availableSeats: 100,
        totalSeats: 100,
      }
      setSession(newSession)
      setIsLoading(false)
    } else {
      // Editing an existing session
      const foundSession = mockSessions.find((s) => s.id === id)
      if (foundSession) {
        setSession(foundSession)
        setSelectedCinemaId(foundSession.cinemaId)
      } else {
        toast({
          variant: "destructive",
          title: "Sessão não encontrada",
          description: "A sessão que você está tentando editar não foi encontrada.",
        })
        router.push("/admin/sessoes")
      }
      setIsLoading(false)
    }
  }, [id, user, authLoading, router, toast])

  const handleInputChange = (field: keyof Session, value: any) => {
    if (session) {
      setSession({ ...session, [field]: value })
    }
  }

  const handleCinemaChange = (cinemaId: string) => {
    setSelectedCinemaId(cinemaId)

    if (session) {
      // Reset room when cinema changes
      setSession({
        ...session,
        cinemaId,
        roomId: "",
        roomName: "",
        roomType: "",
      })
    }
  }

  const handleRoomChange = (roomId: string) => {
    const selectedRoom = mockRooms.find((r) => r.id === roomId)

    if (session && selectedRoom) {
      setSession({
        ...session,
        roomId,
        roomName: selectedRoom.name,
        roomType: selectedRoom.type,
        totalSeats: selectedRoom.totalSeats,
        availableSeats: selectedRoom.totalSeats,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Validate form
    if (!session?.movieId) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Selecione um filme para a sessão.",
      })
      setIsSaving(false)
      return
    }

    if (!session.cinemaId) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Selecione um cinema para a sessão.",
      })
      setIsSaving(false)
      return
    }

    if (!session.roomId) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Selecione uma sala para a sessão.",
      })
      setIsSaving(false)
      return
    }

    // In a real app, this would call an API to save the session
    setTimeout(() => {
      toast({
        title: "Sessão salva",
        description: "A sessão foi salva com sucesso.",
      })
      setIsSaving(false)
      router.push("/admin/sessoes")
    }, 1000)
  }

  if (authLoading || isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Sessão não encontrada</p>
      </div>
    )
  }

  // Get available rooms for selected cinema
  const availableRooms = mockRooms.filter((room) => room.cinemaId === selectedCinemaId)

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8 gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push("/admin/sessoes")}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Voltar</span>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{id === "nova" ? "Adicionar Sessão" : "Editar Sessão"}</h1>
          <p className="text-muted-foreground mt-1">
            {id === "nova" ? "Preencha os dados para adicionar uma nova sessão" : "Edite os dados da sessão"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="movie">Filme</Label>
            <Select value={session.movieId} onValueChange={(value) => handleInputChange("movieId", value)}>
              <SelectTrigger id="movie">
                <SelectValue placeholder="Selecione um filme" />
              </SelectTrigger>
              <SelectContent>
                {mockMovies.map((movie) => (
                  <SelectItem key={movie.id} value={movie.id}>
                    {movie.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cinema">Cinema</Label>
            <Select value={selectedCinemaId} onValueChange={handleCinemaChange}>
              <SelectTrigger id="cinema">
                <SelectValue placeholder="Selecione um cinema" />
              </SelectTrigger>
              <SelectContent>
                {mockCinemas.map((cinema) => (
                  <SelectItem key={cinema.id} value={cinema.id}>
                    {cinema.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Select value={session.roomId} onValueChange={handleRoomChange} disabled={!selectedCinemaId}>
              <SelectTrigger id="room">
                <SelectValue placeholder={selectedCinemaId ? "Selecione uma sala" : "Selecione um cinema primeiro"} />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name} ({room.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={session.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário</Label>
              <Input
                id="time"
                type="time"
                value={session.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                value={session.price}
                onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                min={0}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="availableSeats">Assentos Disponíveis</Label>
              <Input
                id="availableSeats"
                type="number"
                value={session.availableSeats}
                onChange={(e) => handleInputChange("availableSeats", Number.parseInt(e.target.value))}
                min={0}
                max={session.totalSeats}
              />
              <p className="text-xs text-muted-foreground">Total de assentos: {session.totalSeats || 0}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.push("/admin/sessoes")}>
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
                Salvar Sessão
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
