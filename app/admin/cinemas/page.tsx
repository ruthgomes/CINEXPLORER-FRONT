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
import { Edit, Plus, Search, Star, Trash2 } from "lucide-react"
import { useData } from "@/lib/contexts/data-context"

export default function AdminCinemasPage() {
  const { cinemas, deleteCinema } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredCinemas = cinemas.filter(
    (cinema) =>
      cinema.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cinema.city.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = () => {
    if (deleteId) {
      deleteCinema(deleteId)
      setDeleteId(null)
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cinemas</h1>
          <p className="text-muted-foreground">Gerencie os cinemas da rede</p>
        </div>
        <Button asChild>
          <Link href="/admin/cinemas/novo">
            <Plus className="mr-2 h-4 w-4" />
            Novo Cinema
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, endereço ou cidade..."
          className="pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Avaliação</TableHead>
              <TableHead>Salas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCinemas.length > 0 ? (
              filteredCinemas.map((cinema) => (
                <TableRow key={cinema.id}>
                  <TableCell>
                    <div className="w-16 h-16 bg-muted rounded overflow-hidden">
                      {cinema.imageUrl && (
                        <img
                          src={cinema.imageUrl || "/placeholder.svg"}
                          alt={cinema.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{cinema.name}</TableCell>
                  <TableCell>{cinema.address}</TableCell>
                  <TableCell>{cinema.city}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{cinema.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cinema.rooms?.length || 0} salas</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/cinemas/${cinema.id}`}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(cinema.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum cinema encontrado.
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
              Tem certeza que deseja excluir este cinema? Esta ação não pode ser desfeita e todas as sessões associadas
              serão removidas.
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
