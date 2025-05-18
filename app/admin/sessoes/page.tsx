"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Edit, Plus, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockSessions, mockMovies, mockCinemas } from "@/lib/mock-data"
import type { Session } from "@/lib/types"

export default function AdminSessionsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null)

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
      })
      router.push("/")
      return
    }

    // Load sessions
    setSessions(mockSessions)
  }, [user, isLoading, router, toast])

  const filteredSessions = sessions.filter((session) => {
    const movie = mockMovies.find((m) => m.id === session.movieId)
    const cinema = mockCinemas.find((c) => c.id === session.cinemaId)

    return (
      movie?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.date.includes(searchQuery) ||
      session.time.includes(searchQuery) ||
      session.roomName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const handleDeleteClick = (session: Session) => {
    setSessionToDelete(session)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (sessionToDelete) {
      // In a real app, this would call an API to delete the session
      setSessions(sessions.filter((s) => s.id !== sessionToDelete.id))

      toast({
        title: "Sessão excluída",
        description: `A sessão foi excluída com sucesso.`,
      })

      setDeleteDialogOpen(false)
      setSessionToDelete(null)
    }
  }

  const getMovieTitle = (movieId: string) => {
    const movie = mockMovies.find((m) => m.id === movieId)
    return movie ? movie.title : "Filme não encontrado"
  }

  const getCinemaName = (cinemaId: string) => {
    const cinema = mockCinemas.find((c) => c.id === cinemaId)
    return cinema ? cinema.name : "Cinema não encontrado"
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Sessões</h1>
          <p className="text-muted-foreground mt-1">Adicione, edite ou remova sessões de filmes</p>
        </div>
        <Button asChild>
          <Link href="/admin/sessoes/nova">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Sessão
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar sessões..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredSessions.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Filme</TableHead>
                <TableHead className="hidden md:table-cell">Cinema</TableHead>
                <TableHead className="hidden md:table-cell">Sala</TableHead>
                <TableHead className="hidden md:table-cell">Data</TableHead>
                <TableHead className="hidden md:table-cell">Horário</TableHead>
                <TableHead className="hidden md:table-cell">Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{getMovieTitle(session.movieId)}</div>
                    <div className="md:hidden text-sm text-muted-foreground">
                      {getCinemaName(session.cinemaId)} • {session.date.split("-").reverse().join("/")} • {session.time}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getCinemaName(session.cinemaId)}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      {session.roomName}
                      <Badge variant="outline" className="text-xs">
                        {session.roomType}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{session.date.split("-").reverse().join("/")}</TableCell>
                  <TableCell className="hidden md:table-cell">{session.time}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    R$ {session.price.toFixed(2).replace(".", ",")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/sessoes/${session.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(session)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhuma sessão encontrada</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Não encontramos sessões que correspondam à sua busca."
              : "Não há sessões cadastradas no sistema."}
          </p>
          <Button asChild>
            <Link href="/admin/sessoes/nova">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Sessão
            </Link>
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir sessão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
