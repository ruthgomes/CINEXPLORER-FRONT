"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Check, Info, MapPin, Ticket } from "lucide-react"
import { mockCinemas } from "@/lib/mock-data"

// Definição dos tipos de promoções
type PromoType = "daily" | "combo" | "special"

interface Promo {
  slug: string
  title: string
  description: string
  longDescription: string
  type: PromoType
  image: string
  price?: string
  savings?: string
  day?: string
  color?: string
  conditions: string[]
  validCinemas: string[]
  icon: React.ReactNode
}

// Dados das promoções
const promotions: Promo[] = [
  {
    slug: "terca-do-cinema",
    title: "Terça do Cinema",
    description: "Todos os ingressos pela metade do preço às terças-feiras.",
    longDescription:
      "Aproveite a melhor promoção da semana! Todos os ingressos com 50% de desconto às terças-feiras em todos os cinemas da rede CineXplorer. Válido para qualquer sessão, filme e tipo de sala.",
    type: "daily",
    image: "/placeholder.svg?height=600&width=1200",
    day: "Terça-feira",
    color: "primary",
    conditions: [
      "Válido apenas para sessões às terças-feiras",
      "Desconto de 50% sobre o valor do ingresso inteiro",
      "Válido para todos os tipos de sala (2D, 3D, IMAX, etc.)",
      "Não cumulativo com outras promoções",
      "Necessário apresentar documento com foto na entrada",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    slug: "segunda-premiada",
    title: "Segunda Premiada",
    description: "Pipoca grande grátis na compra de dois ingressos às segundas-feiras.",
    longDescription:
      "Comece a semana com o pé direito! Na compra de dois ingressos para qualquer sessão às segundas-feiras, ganhe uma pipoca grande gratuitamente. Promoção válida em todos os cinemas da rede CineXplorer.",
    type: "daily",
    image: "/placeholder.svg?height=600&width=1200",
    day: "Segunda-feira",
    color: "amber",
    conditions: [
      "Válido apenas para sessões às segundas-feiras",
      "Necessário adquirir dois ingressos para a mesma sessão",
      "Pipoca grande tradicional (sem opções de sabores especiais)",
      "Não cumulativo com outras promoções",
      "Retirada da pipoca apenas mediante apresentação dos ingressos",
    ],
    validCinemas: ["1", "2", "3", "5"],
    icon: <Ticket className="h-6 w-6" />,
  },
  {
    slug: "quinta-em-dobro",
    title: "Quinta em Dobro",
    description: "Compre um ingresso e ganhe outro nas sessões de quinta-feira após às 21h.",
    longDescription:
      "Nas quintas-feiras, traga um acompanhante sem pagar a mais! Na compra de um ingresso para sessões após às 21h, você ganha outro ingresso gratuitamente. Ideal para casais ou amigos que querem economizar.",
    type: "daily",
    image: "/placeholder.svg?height=600&width=1200",
    day: "Quinta-feira",
    color: "blue",
    conditions: [
      "Válido apenas para sessões às quintas-feiras com início após às 21h",
      "O ingresso gratuito deve ser para a mesma sessão",
      "Válido para todos os tipos de sala (2D, 3D, IMAX, etc.)",
      "Não cumulativo com outras promoções",
      "Sujeito à disponibilidade de assentos",
    ],
    validCinemas: ["1", "3", "4", "6"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "domingo-em-familia",
    title: "Domingo em Família",
    description: "Desconto progressivo: 10% para 2 pessoas, 20% para 3, 30% para 4 ou mais.",
    longDescription:
      "Domingo é dia de família no cinema! Quanto mais pessoas vierem juntas, maior o desconto. Traga toda a família e economize até 30% no valor total dos ingressos para a mesma sessão.",
    type: "daily",
    image: "/placeholder.svg?height=600&width=1200",
    day: "Domingo",
    color: "green",
    conditions: [
      "Válido apenas para sessões aos domingos",
      "Todos os ingressos devem ser para a mesma sessão",
      "Desconto aplicado sobre o valor total da compra",
      "Não cumulativo com outras promoções",
      "Limite de 8 ingressos por compra nesta promoção",
    ],
    validCinemas: ["1", "2", "3", "4", "5"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "quarta-cultural",
    title: "Quarta Cultural",
    description: "30% de desconto em filmes nacionais e documentários às quartas-feiras.",
    longDescription:
      "Valorize o cinema nacional e documentários com 30% de desconto todas as quartas-feiras! Uma oportunidade para conhecer produções de qualidade com preços especiais.",
    type: "daily",
    image: "/placeholder.svg?height=600&width=1200",
    day: "Quarta-feira",
    color: "purple",
    conditions: [
      "Válido apenas para sessões às quartas-feiras",
      "Aplicável apenas para filmes nacionais e documentários",
      "Desconto de 30% sobre o valor do ingresso inteiro",
      "Não cumulativo com outras promoções",
      "Sujeito à programação de filmes nacionais e documentários em cartaz",
    ],
    validCinemas: ["2", "3", "5", "6"],
    icon: <Film className="h-6 w-6" />,
  },
  {
    slug: "combo-familia",
    title: "Combo Família",
    description: "4 ingressos + 2 pipocas grandes + 4 refrigerantes por um preço especial.",
    longDescription:
      "O combo perfeito para toda a família! Economize com este pacote que inclui 4 ingressos, 2 pipocas grandes e 4 refrigerantes médios. Ideal para famílias que querem uma experiência completa no cinema.",
    type: "combo",
    image: "/placeholder.svg?height=600&width=1200",
    price: "R$ 149,90",
    savings: "Economia de R$ 50,00",
    conditions: [
      "Válido para qualquer dia da semana e sessão",
      "Todos os ingressos devem ser para a mesma sessão",
      "Refrigerantes de 500ml (não substituíveis por outras bebidas)",
      "Pipocas grandes tradicionais (sem opções de sabores especiais)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "combo-casal",
    title: "Combo Casal",
    description: "2 ingressos + 1 pipoca grande + 2 refrigerantes médios.",
    longDescription:
      "Programa a dois com economia! Este combo inclui 2 ingressos, 1 pipoca grande para compartilhar e 2 refrigerantes médios. Perfeito para casais que querem aproveitar uma sessão de cinema juntos.",
    type: "combo",
    image: "/placeholder.svg?height=600&width=1200",
    price: "R$ 79,90",
    savings: "Economia de R$ 25,00",
    conditions: [
      "Válido para qualquer dia da semana e sessão",
      "Os ingressos devem ser para a mesma sessão",
      "Refrigerantes de 500ml (não substituíveis por outras bebidas)",
      "Pipoca grande tradicional (sem opções de sabores especiais)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "combo-premium",
    title: "Combo Premium",
    description: "2 ingressos VIP + 1 pipoca grande + 2 bebidas alcoólicas ou refrigerantes.",
    longDescription:
      "Uma experiência premium para momentos especiais! Este combo inclui 2 ingressos para salas VIP, 1 pipoca grande gourmet e 2 bebidas à sua escolha (incluindo opções alcoólicas). O programa perfeito para uma noite especial.",
    type: "combo",
    image: "/placeholder.svg?height=600&width=1200",
    price: "R$ 119,90",
    savings: "Economia de R$ 35,00",
    conditions: [
      "Válido para qualquer dia da semana e sessão em salas VIP",
      "Os ingressos devem ser para a mesma sessão",
      "Bebidas alcoólicas disponíveis: cerveja, vinho ou drinks selecionados",
      "Necessário apresentar documento com foto para consumo de bebidas alcoólicas",
      "Pipoca grande gourmet com opção de sabor (tradicional, caramelo ou chocolate)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "5"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "combo-solo",
    title: "Combo Solo",
    description: "1 ingresso + 1 pipoca média + 1 refrigerante médio.",
    longDescription:
      "Perfeito para quem gosta de ir ao cinema sozinho! Este combo inclui 1 ingresso, 1 pipoca média e 1 refrigerante médio. Tenha uma experiência completa com o melhor custo-benefício.",
    type: "combo",
    image: "/placeholder.svg?height=600&width=1200",
    price: "R$ 39,90",
    savings: "Economia de R$ 15,00",
    conditions: [
      "Válido para qualquer dia da semana e sessão",
      "Refrigerante de 500ml (não substituível por outras bebidas)",
      "Pipoca média tradicional (sem opções de sabores especiais)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <User className="h-6 w-6" />,
  },
  {
    slug: "combo-amigos",
    title: "Combo Amigos",
    description: "3 ingressos + 2 pipocas grandes + 3 refrigerantes médios.",
    longDescription:
      "Reúna a turma e economize! Este combo inclui 3 ingressos, 2 pipocas grandes para compartilhar e 3 refrigerantes médios. Ideal para grupos de amigos que querem curtir um filme juntos.",
    type: "combo",
    image: "/placeholder.svg?height=600&width=1200",
    price: "R$ 119,90",
    savings: "Economia de R$ 40,00",
    conditions: [
      "Válido para qualquer dia da semana e sessão",
      "Todos os ingressos devem ser para a mesma sessão",
      "Refrigerantes de 500ml (não substituíveis por outras bebidas)",
      "Pipocas grandes tradicionais (sem opções de sabores especiais)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "3", "5", "6"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "desconto-estudante",
    title: "Desconto Estudante",
    description: "50% de desconto para estudantes em qualquer sessão com carteirinha válida.",
    longDescription:
      "Estudantes pagam meia-entrada em qualquer sessão, qualquer dia da semana! Basta apresentar a carteirinha de estudante válida na entrada do cinema. Válido para estudantes de todos os níveis de ensino.",
    type: "special",
    image: "/placeholder.svg?height=600&width=1200",
    conditions: [
      "Válido para qualquer dia da semana e sessão",
      "Necessário apresentar carteirinha de estudante válida com foto",
      "Desconto de 50% sobre o valor do ingresso inteiro",
      "Válido para estudantes de ensino fundamental, médio, técnico, superior e pós-graduação",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    slug: "aniversariante",
    title: "Aniversariante",
    description: "Ingresso grátis no dia do seu aniversário + 30% de desconto para até 3 acompanhantes.",
    longDescription:
      "Comemore seu aniversário no cinema! No dia do seu aniversário, você ganha um ingresso grátis e seus acompanhantes (até 3 pessoas) ganham 30% de desconto. Uma ótima maneira de celebrar seu dia especial.",
    type: "special",
    image: "/placeholder.svg?height=600&width=1200",
    conditions: [
      "Válido apenas no dia do aniversário (data exata)",
      "Necessário apresentar documento oficial com foto que comprove a data de nascimento",
      "Desconto de 30% para até 3 acompanhantes na mesma sessão",
      "Válido para qualquer sessão disponível no dia",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Calendar className="h-6 w-6" />,
  },
  {
    slug: "sessao-madrugada",
    title: "Sessão Madrugada",
    description: "Ingressos com 40% de desconto para todas as sessões após às 23h.",
    longDescription:
      "Para os notívagos de plantão! Todas as sessões com início após às 23h têm 40% de desconto no valor do ingresso. Aproveite para assistir àquele filme que você tanto queria ver por um preço especial.",
    type: "special",
    image: "/placeholder.svg?height=600&width=1200",
    conditions: [
      "Válido apenas para sessões com início após às 23h",
      "Desconto de 40% sobre o valor do ingresso inteiro",
      "Válido para todos os dias da semana",
      "Válido para todos os tipos de sala (2D, 3D, IMAX, etc.)",
      "Não cumulativo com outras promoções",
    ],
    validCinemas: ["1", "3", "5"],
    icon: <Clock className="h-6 w-6" />,
  },
  {
    slug: "clube-cinexplorer",
    title: "Clube CineXplorer",
    description: "Assine o clube e ganhe 20% de desconto em todos os ingressos e combos durante o ano todo.",
    longDescription:
      "Torne-se membro do Clube CineXplorer e aproveite benefícios exclusivos durante o ano todo! Assinantes ganham 20% de desconto em todos os ingressos e combos, além de promoções exclusivas, pré-vendas e eventos especiais.",
    type: "special",
    image: "/placeholder.svg?height=600&width=1200",
    conditions: [
      "Assinatura anual com pagamento recorrente de R$ 19,90/mês",
      "Desconto de 20% em todos os ingressos e combos",
      "Acesso a pré-vendas de grandes lançamentos",
      "Convites para eventos exclusivos e sessões especiais",
      "Acúmulo de pontos para trocar por ingressos e produtos",
      "Cancelamento disponível a qualquer momento",
    ],
    validCinemas: ["1", "2", "3", "4", "5", "6"],
    icon: <Ticket className="h-6 w-6" />,
  },
]

export default function PromotionDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [promotion, setPromotion] = useState<Promo | null>(null)
  const [validCinemas, setValidCinemas] = useState<typeof mockCinemas>([])

  useEffect(() => {
    // Find the promotion by slug
    const foundPromotion = promotions.find((p) => p.slug === slug)
    if (foundPromotion) {
      setPromotion(foundPromotion)

      // Find valid cinemas
      const cinemas = mockCinemas.filter((cinema) => foundPromotion.validCinemas.includes(cinema.id))
      setValidCinemas(cinemas)
    } else {
      // Promotion not found, redirect to promotions page
      router.push("/promocoes")
    }
  }, [slug, router])

  if (!promotion) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  const colorClasses = {
    primary: "from-primary/20 to-black border-primary/20 text-primary",
    amber: "from-amber-900/20 to-black border-amber-900/20 text-amber-500",
    blue: "from-blue-900/20 to-black border-blue-900/20 text-blue-500",
    green: "from-green-900/20 to-black border-green-900/20 text-green-500",
    purple: "from-purple-900/20 to-black border-purple-900/20 text-purple-500",
  }

  const badgeClasses = {
    primary: "bg-primary/20 text-primary hover:bg-primary/30",
    amber: "bg-amber-900/20 text-amber-500 hover:bg-amber-900/30",
    blue: "bg-blue-900/20 text-blue-500 hover:bg-blue-900/30",
    green: "bg-green-900/20 text-green-500 hover:bg-green-900/30",
    purple: "bg-purple-900/20 text-purple-500 hover:bg-purple-900/30",
  }

  return (
    <div className="container py-8 md:py-12">
      <Link href="/promocoes" className="text-primary hover:underline mb-4 inline-block">
        ← Voltar para promoções
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative h-[300px] w-full rounded-lg overflow-hidden mb-6">
            <Image src={promotion.image || "/placeholder.svg"} alt={promotion.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              {promotion.type === "daily" && promotion.day && promotion.color && (
                <Badge className={`mb-2 ${badgeClasses[promotion.color as keyof typeof badgeClasses]}`}>
                  {promotion.day}
                </Badge>
              )}
              <h1 className="text-3xl font-bold tracking-tight">{promotion.title}</h1>
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="details">Detalhes</TabsTrigger>
              <TabsTrigger value="conditions">Condições</TabsTrigger>
              <TabsTrigger value="cinemas">Cinemas Participantes</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-lg">{promotion.longDescription}</p>

                {promotion.type === "combo" && (
                  <div className="mt-8 bg-card rounded-lg p-6">
                    <h3 className="text-xl font-bold mb-4">O que está incluso:</h3>
                    <ul className="space-y-2">
                      {promotion.title === "Combo Família" && (
                        <>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>4 ingressos para a mesma sessão</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 pipocas grandes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>4 refrigerantes médios (500ml)</span>
                          </li>
                        </>
                      )}
                      {promotion.title === "Combo Casal" && (
                        <>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 ingressos para a mesma sessão</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>1 pipoca grande</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 refrigerantes médios (500ml)</span>
                          </li>
                        </>
                      )}
                      {promotion.title === "Combo Premium" && (
                        <>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 ingressos para sala VIP</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>1 pipoca grande gourmet (sabores à escolha)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 bebidas à escolha (incluindo opções alcoólicas)</span>
                          </li>
                        </>
                      )}
                      {promotion.title === "Combo Solo" && (
                        <>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>1 ingresso</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>1 pipoca média</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>1 refrigerante médio (500ml)</span>
                          </li>
                        </>
                      )}
                      {promotion.title === "Combo Amigos" && (
                        <>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>3 ingressos para a mesma sessão</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>2 pipocas grandes</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>3 refrigerantes médios (500ml)</span>
                          </li>
                        </>
                      )}
                    </ul>
                    <div className="mt-6 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Preço</p>
                        <p className="text-2xl font-bold">{promotion.price}</p>
                      </div>
                      <Badge variant="outline" className="text-green-500">
                        {promotion.savings}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="conditions" className="space-y-6">
              <div className="bg-card rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <h3 className="text-xl font-bold">Termos e Condições</h3>
                </div>
                <ul className="space-y-3">
                  {promotion.conditions.map((condition, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{condition}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="cinemas" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {validCinemas.map((cinema) => (
                  <Card key={cinema.id} className="overflow-hidden">
                    <div className="relative h-40 w-full">
                      <Image
                        src={cinema.imageUrl || "/placeholder.svg?height=300&width=600"}
                        alt={cinema.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-bold text-lg">{cinema.name}</h3>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground line-clamp-2">{cinema.address}</p>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/cinemas/${cinema.id}`}>Ver detalhes</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card
            className={
              promotion.type === "daily" && promotion.color
                ? `bg-gradient-to-br ${colorClasses[promotion.color as keyof typeof colorClasses]} overflow-hidden`
                : undefined
            }
          >
            <CardContent className="p-6">
              {promotion.type === "daily" && promotion.day && promotion.color && (
                <Badge className={`mb-4 ${badgeClasses[promotion.color as keyof typeof badgeClasses]}`}>
                  {promotion.day}
                </Badge>
              )}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={
                    promotion.type === "daily" && promotion.color
                      ? `text-${promotion.color === "primary" ? "primary" : promotion.color}-500`
                      : "text-primary"
                  }
                >
                  {promotion.icon}
                </div>
                <h3 className="text-xl font-bold">{promotion.title}</h3>
              </div>
              <p className="text-muted-foreground mb-6">{promotion.description}</p>

              {promotion.type === "combo" && (
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Preço</p>
                    <p className="text-2xl font-bold">{promotion.price}</p>
                  </div>
                  <Badge variant="outline" className="text-green-500">
                    {promotion.savings}
                  </Badge>
                </div>
              )}

              <Button className="w-full">
                {promotion.type === "combo" ? "Comprar agora" : "Ver sessões disponíveis"}
              </Button>

              <div className="mt-6 flex items-start gap-2 p-3 bg-background/20 rounded-md text-sm">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Informações importantes</p>
                  <p className="text-muted-foreground mt-1">
                    {promotion.type === "daily"
                      ? `Promoção válida apenas às ${promotion.day?.toLowerCase()}s.`
                      : promotion.type === "combo"
                        ? "Combo disponível em todos os cinemas participantes."
                        : "Consulte os termos e condições para mais detalhes."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Outras promoções que podem te interessar</h3>
            <div className="space-y-4">
              {promotions
                .filter((p) => p.slug !== promotion.slug && p.type === promotion.type)
                .slice(0, 3)
                .map((promo) => (
                  <Link
                    key={promo.slug}
                    href={`/promocoes/${promo.slug}`}
                    className="flex gap-4 p-3 border rounded-lg hover:bg-card/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        promo.type === "daily" && promo.color
                          ? `bg-${promo.color === "primary" ? "primary" : promo.color}-500/20 text-${
                              promo.color === "primary" ? "primary" : promo.color
                            }-500`
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {promo.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{promo.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{promo.description}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Users(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function User(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
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

function Clock(props: React.SVGProps<SVGSVGElement>) {
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
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}
