"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Ticket, Users } from "lucide-react"

export default function PromocoesPage() {
  const [activeTab, setActiveTab] = useState("todas")

  return (
    <div className="container py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promoções</h1>
          <p className="text-muted-foreground mt-1">Aproveite descontos e ofertas especiais nos cinemas</p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-full md:w-auto">
          <TabsTrigger value="todas">Todas</TabsTrigger>
          <TabsTrigger value="diarias">Promoções Diárias</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="especiais">Especiais</TabsTrigger>
        </TabsList>

        <TabsContent value="todas" className="mt-0">
          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Promoções Diárias</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PromocaoDiaria
                  title="Terça do Cinema"
                  description="Todos os ingressos pela metade do preço às terças-feiras."
                  day="Terça-feira"
                  color="primary"
                  icon={<Calendar className="h-12 w-12" />}
                />
                <PromocaoDiaria
                  title="Segunda Premiada"
                  description="Pipoca grande grátis na compra de dois ingressos às segundas-feiras."
                  day="Segunda-feira"
                  color="amber"
                  icon={<Ticket className="h-12 w-12" />}
                />
                <PromocaoDiaria
                  title="Quinta em Dobro"
                  description="Compre um ingresso e ganhe outro nas sessões de quinta-feira após às 21h."
                  day="Quinta-feira"
                  color="blue"
                  icon={<Users className="h-12 w-12" />}
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Combos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ComboPromo
                  title="Combo Família"
                  description="4 ingressos + 2 pipocas grandes + 4 refrigerantes por um preço especial."
                  price="R$ 149,90"
                  savings="Economia de R$ 50,00"
                  image="/placeholder.svg?height=200&width=400"
                />
                <ComboPromo
                  title="Combo Casal"
                  description="2 ingressos + 1 pipoca grande + 2 refrigerantes médios."
                  price="R$ 79,90"
                  savings="Economia de R$ 25,00"
                  image="/placeholder.svg?height=200&width=400"
                />
                <ComboPromo
                  title="Combo Premium"
                  description="2 ingressos VIP + 1 pipoca grande + 2 bebidas alcoólicas ou refrigerantes."
                  price="R$ 119,90"
                  savings="Economia de R$ 35,00"
                  image="/placeholder.svg?height=200&width=400"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Promoções Especiais</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EspecialPromo
                  title="Desconto Estudante"
                  description="50% de desconto para estudantes em qualquer sessão com carteirinha válida."
                  conditions="Válido para estudantes com carteirinha atualizada. Não cumulativo com outras promoções."
                  icon={<Users className="h-16 w-16" />}
                />
                <EspecialPromo
                  title="Aniversariante"
                  description="Ingresso grátis no dia do seu aniversário + 30% de desconto para até 3 acompanhantes."
                  conditions="Válido apenas no dia do aniversário mediante apresentação de documento com foto."
                  icon={<Calendar className="h-16 w-16" />}
                />
                <EspecialPromo
                  title="Sessão Madrugada"
                  description="Ingressos com 40% de desconto para todas as sessões após às 23h."
                  conditions="Válido para sessões com início após às 23h. Não cumulativo com outras promoções."
                  icon={<Clock className="h-16 w-16" />}
                />
                <EspecialPromo
                  title="Clube CineXplorer"
                  description="Assine o clube e ganhe 20% de desconto em todos os ingressos e combos durante o ano todo."
                  conditions="Assinatura anual com pagamento recorrente. Consulte o regulamento completo."
                  icon={<Ticket className="h-16 w-16" />}
                />
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="diarias" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PromocaoDiaria
              title="Terça do Cinema"
              description="Todos os ingressos pela metade do preço às terças-feiras."
              day="Terça-feira"
              color="primary"
              icon={<Calendar className="h-12 w-12" />}
            />
            <PromocaoDiaria
              title="Segunda Premiada"
              description="Pipoca grande grátis na compra de dois ingressos às segundas-feiras."
              day="Segunda-feira"
              color="amber"
              icon={<Ticket className="h-12 w-12" />}
            />
            <PromocaoDiaria
              title="Quinta em Dobro"
              description="Compre um ingresso e ganhe outro nas sessões de quinta-feira após às 21h."
              day="Quinta-feira"
              color="blue"
              icon={<Users className="h-12 w-12" />}
            />
            <PromocaoDiaria
              title="Domingo em Família"
              description="Desconto progressivo: 10% para 2 pessoas, 20% para 3, 30% para 4 ou mais."
              day="Domingo"
              color="green"
              icon={<Users className="h-12 w-12" />}
            />
            <PromocaoDiaria
              title="Quarta Cultural"
              description="30% de desconto em filmes nacionais e documentários às quartas-feiras."
              day="Quarta-feira"
              color="purple"
              icon={<Film className="h-12 w-12" />}
            />
          </div>
        </TabsContent>

        <TabsContent value="combos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ComboPromo
              title="Combo Família"
              description="4 ingressos + 2 pipocas grandes + 4 refrigerantes por um preço especial."
              price="R$ 149,90"
              savings="Economia de R$ 50,00"
              image="/placeholder.svg?height=200&width=400"
            />
            <ComboPromo
              title="Combo Casal"
              description="2 ingressos + 1 pipoca grande + 2 refrigerantes médios."
              price="R$ 79,90"
              savings="Economia de R$ 25,00"
              image="/placeholder.svg?height=200&width=400"
            />
            <ComboPromo
              title="Combo Premium"
              description="2 ingressos VIP + 1 pipoca grande + 2 bebidas alcoólicas ou refrigerantes."
              price="R$ 119,90"
              savings="Economia de R$ 35,00"
              image="/placeholder.svg?height=200&width=400"
            />
            <ComboPromo
              title="Combo Solo"
              description="1 ingresso + 1 pipoca média + 1 refrigerante médio."
              price="R$ 39,90"
              savings="Economia de R$ 15,00"
              image="/placeholder.svg?height=200&width=400"
            />
            <ComboPromo
              title="Combo Amigos"
              description="3 ingressos + 2 pipocas grandes + 3 refrigerantes médios."
              price="R$ 119,90"
              savings="Economia de R$ 40,00"
              image="/placeholder.svg?height=200&width=400"
            />
          </div>
        </TabsContent>

        <TabsContent value="especiais" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EspecialPromo
              title="Desconto Estudante"
              description="50% de desconto para estudantes em qualquer sessão com carteirinha válida."
              conditions="Válido para estudantes com carteirinha atualizada. Não cumulativo com outras promoções."
              icon={<Users className="h-16 w-16" />}
            />
            <EspecialPromo
              title="Aniversariante"
              description="Ingresso grátis no dia do seu aniversário + 30% de desconto para até 3 acompanhantes."
              conditions="Válido apenas no dia do aniversário mediante apresentação de documento com foto."
              icon={<Calendar className="h-16 w-16" />}
            />
            <EspecialPromo
              title="Sessão Madrugada"
              description="Ingressos com 40% de desconto para todas as sessões após às 23h."
              conditions="Válido para sessões com início após às 23h. Não cumulativo com outras promoções."
              icon={<Clock className="h-16 w-16" />}
            />
            <EspecialPromo
              title="Clube CineXplorer"
              description="Assine o clube e ganhe 20% de desconto em todos os ingressos e combos durante o ano todo."
              conditions="Assinatura anual com pagamento recorrente. Consulte o regulamento completo."
              icon={<Ticket className="h-16 w-16" />}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PromocaoDiariaProps {
  title: string
  description: string
  day: string
  color: "primary" | "amber" | "blue" | "green" | "purple"
  icon: React.ReactNode
}

function PromocaoDiaria({ title, description, day, color, icon }: PromocaoDiariaProps) {
  const colorClasses = {
    primary: "from-primary/20 to-black border-primary/20",
    amber: "from-amber-900/20 to-black border-amber-900/20",
    blue: "from-blue-900/20 to-black border-blue-900/20",
    green: "from-green-900/20 to-black border-green-900/20",
    purple: "from-purple-900/20 to-black border-purple-900/20",
  }

  const badgeClasses = {
    primary: "bg-primary/20 text-primary hover:bg-primary/30",
    amber: "bg-amber-900/20 text-amber-500 hover:bg-amber-900/30",
    blue: "bg-blue-900/20 text-blue-500 hover:bg-blue-900/30",
    green: "bg-green-900/20 text-green-500 hover:bg-green-900/30",
    purple: "bg-purple-900/20 text-purple-500 hover:bg-purple-900/30",
  }

  return (
    <Card className={`bg-gradient-to-br ${colorClasses[color]} overflow-hidden`}>
      <CardContent className="p-6">
        <Badge className={`mb-4 ${badgeClasses[color]}`}>{day}</Badge>
        <div className="flex items-center gap-4 mb-4">
          <div className={`text-${color === "primary" ? "primary" : color}-500`}>{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/promocoes/${title.toLowerCase().replace(/\s+/g, "-")}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ComboPromoProps {
  title: string
  description: string
  price: string
  savings: string
  image: string
}

function ComboPromo({ title, description, price, savings, image }: ComboPromoProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
      </div>
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Preço</p>
            <p className="text-2xl font-bold">{price}</p>
          </div>
          <Badge variant="outline" className="text-green-500">
            {savings}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/promocoes/${title.toLowerCase().replace(/\s+/g, "-")}`}>Comprar</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

interface EspecialPromoProps {
  title: string
  description: string
  conditions: string
  icon: React.ReactNode
}

function EspecialPromo({ title, description, conditions, icon }: EspecialPromoProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-primary/10 p-4 rounded-full text-primary">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="bg-muted p-3 rounded-md">
          <p className="text-sm text-muted-foreground">{conditions}</p>
        </div>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0">
        <Button asChild variant="default" className="w-full">
          <Link href={`/promocoes/${title.toLowerCase().replace(/\s+/g, "-")}`}>Ver detalhes</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function Film(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </svg>
  )
}
