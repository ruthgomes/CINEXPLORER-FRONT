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
import { Edit, MapPin, Plus, Search, Trash2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockCinemas } from "@/lib/mock-data"
import type { Cinema } from "@/lib/types"

export default function AdminCinemasPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [cinemaToDelete, setCinemaToDelete] = useState<Cinema | null>(null)

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

    // Load cinemas
    setCinemas(mockCinemas)
  }, [user, isLoading, router, toast])

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteClick = (cinema: Cinema) => {
    setCinemaToDelete(cinema)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (cinemaToDelete) {
      // In a real app, this would call an API to delete the cinema
      setCinemas(cinemas.filter((c) => c.id !== cinemaToDelete.id))

      toast({
        title: "Cinema excluído",
        description: `O cinema "${cinemaToDelete.name}" foi excluído com sucesso.`,
      })

      setDeleteDialogOpen(false)
      setCinemaToDelete(null)
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
          <h1 className="text-3xl font-bold tracking-tight">Gerenciar Cinemas</h1>
          <p className="text-muted-foreground mt-1">Adicione, edite ou remova cinemas do sistema</p>
        </div>
        <Button asChild>
          <Link href="/admin/cinemas/novo">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Cinema
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar cinemas..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredCinemas.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead className="hidden md:table-cell">Tipos de Sala</TableHead>
                <TableHead className="hidden md:table-cell">Avaliação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCinemas.map((cinema) => (
                <TableRow key={cinema.id}>
                  <TableCell className="font-medium">{cinema.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{cinema.name}</div>
                    <div className="md:hidden text-sm text-muted-foreground truncate max-w-[200px]">
                      {cinema.address}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{cinema.address}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {cinema.roomTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
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
                      <span>{cinema.rating}</span>
                      <span className="text-xs text-muted-foreground">({cinema.reviewCount})</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/cinemas/${cinema.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(cinema)}>
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
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Nenhum cinema encontrado</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? "Não encontramos cinemas que correspondam à sua busca."
              : "Não há cinemas cadastrados no sistema."}
          </p>
          <Button asChild>
            <Link href="/admin/cinemas/novo">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Cinema
            </Link>
          </Button>
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir cinema</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o cinema "{cinemaToDelete?.name}"? Esta ação não pode ser desfeita.
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
