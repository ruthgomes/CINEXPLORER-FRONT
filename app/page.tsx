"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Star, Ticket } from "lucide-react"
import MovieCard from "@/components/movie-card"
import CinemaCard from "@/components/cinema-card"
import HeroSection from "@/components/hero-section"
import LocationPermission from "@/components/location-permission"
import { useData } from "@/lib/contexts/data-context"

export default function Home() {
  const { movies, cinemas } = useData()
  const featuredMovies = movies.filter((movie) => !movie.isComingSoon).slice(0, 6)
  const comingSoonMovies = movies.filter((movie) => movie.isComingSoon).slice(0, 6)
  const nearbyCinemas = cinemas.slice(0, 4)

  return (
    <div className="flex flex-col min-h-screen">
      <LocationPermission />
      <HeroSection />

      <section className="py-12 md:py-16 bg-black">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Filmes em Cartaz</h2>
              <p className="text-muted-foreground mt-1">Os melhores filmes nos cinemas agora</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/em-cartaz">Ver todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Cinemas Próximos</h2>
              <p className="text-muted-foreground mt-1">Encontre o cinema mais perto de você</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/cinemas">Ver todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nearbyCinemas.map((cinema) => (
              <CinemaCard key={cinema.id} cinema={cinema} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Em Breve</h2>
              <p className="text-muted-foreground mt-1">Fique por dentro dos próximos lançamentos</p>
            </div>
            <Button asChild variant="outline" className="mt-4 md:mt-0">
              <Link href="/em-breve">Ver todos</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {comingSoonMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Promoções Especiais</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Aproveite nossas ofertas exclusivas e economize na sua próxima ida ao cinema
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-primary/20 to-black border-primary/20 overflow-hidden">
              <CardContent className="p-6">
                <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">Terça-feira</Badge>
                <h3 className="text-xl font-bold mb-2">Terça do Cinema</h3>
                <p className="text-muted-foreground mb-4">Todos os ingressos pela metade do preço às terças-feiras.</p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/promocoes/terca-do-cinema">Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/20 to-black border-amber-900/20 overflow-hidden">
              <CardContent className="p-6">
                <Badge className="mb-4 bg-amber-900/20 text-amber-500 hover:bg-amber-900/30">Combo</Badge>
                <h3 className="text-xl font-bold mb-2">Combo Família</h3>
                <p className="text-muted-foreground mb-4">
                  4 ingressos + 2 pipocas grandes + 4 refrigerantes por um preço especial.
                </p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/promocoes/combo-familia">Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/20 to-black border-blue-900/20 overflow-hidden">
              <CardContent className="p-6">
                <Badge className="mb-4 bg-blue-900/20 text-blue-500 hover:bg-blue-900/30">Estudante</Badge>
                <h3 className="text-xl font-bold mb-2">Desconto Estudante</h3>
                <p className="text-muted-foreground mb-4">
                  50% de desconto para estudantes em qualquer sessão com carteirinha válida.
                </p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/promocoes/desconto-estudante">Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Baixe Nosso Aplicativo</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Compre ingressos, veja horários e receba ofertas exclusivas diretamente no seu celular
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="md:w-1/2 lg:w-1/3">
              <Image
                src="/placeholder.svg?height=600&width=300"
                alt="CineXplorer App"
                width={300}
                height={600}
                className="rounded-xl shadow-2xl mx-auto"
              />
            </div>
            <div className="md:w-1/2 lg:w-1/3 space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Ticket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Compra Rápida</h3>
                  <p className="text-muted-foreground">Compre ingressos em segundos, sem filas ou complicações.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Ofertas Exclusivas</h3>
                  <p className="text-muted-foreground">
                    Receba promoções e descontos disponíveis apenas no aplicativo.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary/20 p-3 rounded-full">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Programação Atualizada</h3>
                  <p className="text-muted-foreground">
                    Acesse a programação completa e receba notificações de estreias.
                  </p>
                </div>
              </div>
              <div className="pt-4 flex gap-4">
                <Button className="flex-1">App Store</Button>
                <Button className="flex-1">Google Play</Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
