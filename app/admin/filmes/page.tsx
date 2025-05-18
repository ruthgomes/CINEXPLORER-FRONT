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
import { Edit, Film, Plus, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockMovies } from "@/lib/mock-data"
import type { Movie } from "@/lib/types"

export default function AdminMoviesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)

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

    // Load movies
    setMovies(mockMovies)
  }, [user, isLoading, router, toast])

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movie.genres.some((genre) => genre.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDeleteClick = (movie: Movie) => {
    setMovieToDelete(movie)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (movieToDelete) {
      // In a real app, this would call an API to delete the movie
      setMovies(movies.filter((m) => m.id !== movieToDelete.id))

      toast({
        title: "Filme excluído",
        description: `O filme "${movieToDelete.title}" foi excluído com sucesso.`,
      })

      setDeleteDialogOpen(false)
      setMovieToDelete(null)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Filmes</h1>
          <p className="text-muted-foreground mt-1">Adicione, edite ou remova filmes do sistema</p>
        </div>
        <Button asChild>
          <Link href="/admin/filmes/novo">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Filme
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar filmes..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredMovies.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead className="hidden md:table-cell">Classificação</TableHead>
                <TableHead className="hidden md:table-cell">Duração</TableHead>
                <TableHead className="hidden md:table-cell">Gêneros</TableHead>
                <TableHead className="hidden md:table-cell">Estreia</TableHead>
                <TableHead className="hidden md:table-cell">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovies.map((movie) => (
                <TableRow key={movie.id}>
                  <TableCell className="font-medium">{movie.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{movie.title}</div>
                    <div className="md:hidden text-sm text-muted-foreground">
                      {movie.classification} • {movie.duration} min
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{movie.classification}</TableCell>
                  <TableCell className="hidden md:table-cell">{movie.duration} min</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {movie.genres.slice(0, 2).map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                      {movie.genres.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{movie.genres.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{movie.releaseDate}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {movie.isComingSoon ? (
                      <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Em breve</Badge>
                    ) : (
                      <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Em cartaz</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/filmes/${movie.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(movie)}>
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
          <Film className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum filme encontrado</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Não encontramos filmes que correspondam à sua busca."
              : "Não há filmes cadastrados no sistema."}
          </p>
          <Button asChild>
            <Link href="/admin/filmes/novo">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Filme
            </Link>
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir filme</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o filme "{movieToDelete?.title}"? Esta ação não pode ser desfeita.
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
