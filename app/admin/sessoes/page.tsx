"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { useData } from "@/lib/contexts/data-context"

export default function AdminSessoesPage() {
  const { movies, cinemas, sessions, deleteSession } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredSessions = sessions.filter((session) => {
    const movie = movies.find((m) => m.id === session.movieId)
    const cinema = cinemas.find((c) => c.id === session.cinemaId)

    if (!movie || !cinema) return false

    const searchLower = searchQuery.toLowerCase()
    return (
      movie.title.toLowerCase().includes(searchLower) ||
      cinema.name.toLowerCase().includes(searchLower) ||
      session.date.toLowerCase().includes(searchLower) ||
      session.time.toLowerCase().includes(searchLower)
    )
  })

  const handleDelete = () => {
    if (deleteId) {
      deleteSession(deleteId)
      setDeleteId(null)
    }
  }

  const getMovieTitle = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId)
    return movie ? movie.title : "Filme não encontrado"
  }

  const getCinemaName = (cinemaId: string) => {
    const cinema = cinemas.find((c) => c.id === cinemaId)
    return cinema ? cinema.name : "Cinema não encontrado"
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sessões</h1>
          <p className="text-muted-foreground">Gerencie as sessões de filmes</p>
        </div>
        <Button asChild>
          <Link href="/admin/sessoes/nova">
            <Plus className="mr-2 h-4 w-4" />
            Nova Sessão
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por filme, cinema ou data..."
          className="pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filme</TableHead>
              <TableHead>Cinema</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Horário</TableHead>
              <TableHead>Sala</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{getMovieTitle(session.movieId)}</TableCell>
                  <TableCell>{getCinemaName(session.cinemaId)}</TableCell>
                  <TableCell>{new Date(session.date).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{session.time}</TableCell>
                  <TableCell>
                    <Badge variant="outline">Sala {session.room?.number}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        session.room?.type === "IMAX"
                          ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          : session.room?.type === "4DX"
                            ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                            : session.room?.type === "VIP"
                              ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
                      }
                    >
                      {session.room?.type || "Padrão"}
                    </Badge>
                  </TableCell>
                  <TableCell>R$ {session.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/sessoes/${session.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(session.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhuma sessão encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta sessão? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
