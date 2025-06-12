"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, MapPin, Calendar, Users, TrendingUp, DollarSign, Clock, Ticket } from "lucide-react"
import { useData } from "@/lib/contexts/data-context"

export default function AdminPage() {
  const { movies, cinemas, sessions } = useData()

  // Calculate dashboard metrics
  const totalMovies = movies.length
  const totalCinemas = cinemas.length
  const totalSessions = sessions.length
  const activeMovies = movies.filter((movie) => !movie.isComingSoon).length
  const comingSoonMovies = movies.filter((movie) => movie.isComingSoon).length

  // Calculate estimated revenue (just a mock calculation)
  const estimatedRevenue = sessions.reduce((total, session) => {
    // Assume 50% occupancy and average ticket price of R$25
    const averageOccupancy = 0.5
    const averageTicketPrice = 25
    const seatsCount = session.room?.capacity || 100
    return total + seatsCount * averageOccupancy * averageTicketPrice
  }, 0)

  // Calculate most popular movie (by session count)
  const movieSessionCounts = movies.map((movie) => {
    const sessionCount = sessions.filter((session) => session.movieId === movie.id).length
    return { ...movie, sessionCount }
  })

  const mostPopularMovie = movieSessionCounts.sort((a, b) => b.sessionCount - a.sessionCount)[0]

  // Calculate busiest cinema
  const cinemaSessionCounts = cinemas.map((cinema) => {
    const sessionCount = sessions.filter((session) => session.cinemaId === cinema.id).length
    return { ...cinema, sessionCount }
  })

  const busiestCinema = cinemaSessionCounts.sort((a, b) => b.sessionCount - a.sessionCount)[0]

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Última atualização: Agora</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Filmes Ativos</CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeMovies}</div>
                <p className="text-xs text-muted-foreground">+{comingSoonMovies} em breve</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Cinemas</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalCinemas}</div>
                <p className="text-xs text-muted-foreground">Em {totalCinemas} localizações</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessões</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
                <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Estimada</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {estimatedRevenue.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">+12% do mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Visão Geral</CardTitle>
                <CardDescription>Resumo da performance do sistema de cinemas.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Gráfico de performance (dados simulados)
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Destaques</CardTitle>
                <CardDescription>Principais métricas e informações.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Film className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Filme Mais Popular</p>
                      <p className="text-sm text-muted-foreground">
                        {mostPopularMovie?.title || "Nenhum"} ({mostPopularMovie?.sessionCount || 0} sessões)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Cinema Mais Movimentado</p>
                      <p className="text-sm text-muted-foreground">
                        {busiestCinema?.name || "Nenhum"} ({busiestCinema?.sessionCount || 0} sessões)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Ocupação Média</p>
                      <p className="text-sm text-muted-foreground">50% dos assentos (estimativa)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Crescimento</p>
                      <p className="text-sm text-muted-foreground">+8% em vendas comparado ao mês anterior</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Próximas Estreias</CardTitle>
                  <CardDescription>Filmes que estreiam em breve.</CardDescription>
                </div>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {movies
                    .filter((movie) => movie.isComingSoon)
                    .slice(0, 3)
                    .map((movie) => (
                      <div key={movie.id} className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-muted rounded overflow-hidden">
                          {movie.posterUrl && (
                            <img
                              src={movie.posterUrl || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{movie.title}</p>
                          <p className="text-xs text-muted-foreground">
                            Estreia em {new Date(movie.releaseDate).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Sessões de Hoje</CardTitle>
                  <CardDescription>Sessões programadas para hoje.</CardDescription>
                </div>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => {
                    const movie = movies.find((m) => m.id === session.movieId)
                    const cinema = cinemas.find((c) => c.id === session.cinemaId)

                    return (
                      <div key={session.id} className="flex items-center gap-3">
                        <div className="w-10 h-14 bg-muted rounded overflow-hidden">
                          {movie?.posterUrl && (
                            <img
                              src={movie.posterUrl || "/placeholder.svg"}
                              alt={movie.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{movie?.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {cinema?.name} • {session.time} • Sala {session.room?.number}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>Acesso rápido às principais funções.</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/admin/filmes/novo"
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Film className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">Novo Filme</span>
                  </Link>

                  <Link
                    href="/admin/cinemas/novo"
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <MapPin className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">Novo Cinema</span>
                  </Link>

                  <Link
                    href="/admin/sessoes/nova"
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <Calendar className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">Nova Sessão</span>
                  </Link>

                  <Link
                    href="/admin/relatorios"
                    className="flex flex-col items-center justify-center p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                  >
                    <TrendingUp className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">Relatórios</span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análises Detalhadas</CardTitle>
              <CardDescription>Visualize métricas detalhadas de desempenho.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Gráficos de análise detalhada (em desenvolvimento)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios</CardTitle>
              <CardDescription>Gere e visualize relatórios personalizados.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Sistema de relatórios (em desenvolvimento)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
