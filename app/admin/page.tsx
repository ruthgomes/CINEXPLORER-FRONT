"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { BarChart3, Edit, Film, MapPin, Plus, Search, Ticket, Trash2, Users } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { mockMovies, mockCinemas, mockSessions } from "@/lib/mock-data"

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta página.",
      })
      router.push("/")
    }
  }, [user, isLoading, router, toast])

  if (isLoading || !user || user.role !== "admin") {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  // Obter os dados para o dashboard
  const totalMovies = mockMovies.length
  const totalCinemas = mockCinemas.length
  const totalSessions = mockSessions.length
  const totalUsers = 843 // Valor fictício para demonstração

  // Obter os filmes mais recentes para exibição rápida
  const recentMovies = [...mockMovies]
    .sort((a, b) => {
      const dateA = new Date(a.releaseDate.split("/").reverse().join("-"))
      const dateB = new Date(b.releaseDate.split("/").reverse().join("-"))
      return dateB.getTime() - dateA.getTime()
    })
    .slice(0, 5)

  // Obter as sessões mais recentes
  const recentSessions = [...mockSessions].slice(0, 5)

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">Gerencie cinemas, filmes e sessões</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="movies">Filmes</TabsTrigger>
          <TabsTrigger value="cinemas">Cinemas</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Filmes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalMovies}</div>
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cinemas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalCinemas}</div>
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Sessões</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalSessions}</div>
                  <Ticket className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários Registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{totalUsers}</div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Filmes Recentes</CardTitle>
                  <CardDescription>Últimos filmes adicionados ao sistema</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/filmes">Ver todos</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Estreia</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMovies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">{movie.title}</TableCell>
                        <TableCell>{movie.releaseDate}</TableCell>
                        <TableCell>
                          {movie.isComingSoon ? (
                            <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">Em breve</Badge>
                          ) : (
                            <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Em cartaz</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Sessões Recentes</CardTitle>
                  <CardDescription>Últimas sessões adicionadas ao sistema</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/sessoes">Ver todas</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="movies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciar Filmes</CardTitle>
                <CardDescription>Adicione, edite ou remova filmes do sistema</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/filmes/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Filme
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar filmes..."
                    className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Classificação</TableHead>
                      <TableHead className="hidden md:table-cell">Estreia</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockMovies.slice(0, 5).map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">{movie.id}</TableCell>
                        <TableCell>{movie.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{movie.classification}</TableCell>
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
                            <Button variant="ghost" size="icon">
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

              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/filmes">Ver todos os filmes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cinemas">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciar Cinemas</CardTitle>
                <CardDescription>Adicione, edite ou remova cinemas do sistema</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/cinemas/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Cinema
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar cinemas..."
                    className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead className="hidden md:table-cell">Endereço</TableHead>
                      <TableHead className="hidden md:table-cell">Avaliação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCinemas.slice(0, 5).map((cinema) => (
                      <TableRow key={cinema.id}>
                        <TableCell className="font-medium">{cinema.id}</TableCell>
                        <TableCell>{cinema.name}</TableCell>
                        <TableCell className="hidden md:table-cell truncate max-w-[300px]">{cinema.address}</TableCell>
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
                            <Button variant="ghost" size="icon">
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

              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/cinemas">Ver todos os cinemas</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Gerenciar Sessões</CardTitle>
                <CardDescription>Adicione, edite ou remova sessões de filmes</CardDescription>
              </div>
              <Button asChild>
                <Link href="/admin/sessoes/nova">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Sessão
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-6">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="search"
                    placeholder="Buscar sessões..."
                    className="pl-8 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>Filme</TableHead>
                      <TableHead className="hidden md:table-cell">Cinema</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="hidden md:table-cell">Horário</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSessions.slice(0, 5).map((session) => {
                      const movie = mockMovies.find((m) => m.id === session.movieId)
                      const cinema = mockCinemas.find((c) => c.id === session.cinemaId)
                      return (
                        <TableRow key={session.id}>
                          <TableCell className="font-medium">{session.id}</TableCell>
                          <TableCell>{movie?.title || "Filme não encontrado"}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {cinema?.name || "Cinema não encontrado"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {session.date.split("-").reverse().join("/")}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{session.time}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button asChild variant="ghost" size="icon">
                                <Link href={`/admin/sessoes/${session.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Editar</span>
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-center mt-4">
                <Button asChild variant="outline">
                  <Link href="/admin/sessoes">Ver todas as sessões</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
