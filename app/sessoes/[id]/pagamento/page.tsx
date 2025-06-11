"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { ArrowLeft, CreditCard, QrCode, Loader2, CheckCircle2 } from "lucide-react"
import { mockMovies } from "@/lib/mock-data"
import QRCode from 'react-qr-code';

type CheckoutData = {
  sessionId: string
  movieId?: string
  cinemaId?: string
  selectedSeats: { row: string; number: number }[]
  ticketTypes: { [key: string]: string }
  totalPrice: number
  movieTitle?: string
  cinemaName?: string
  roomName?: string
  date?: string
  time?: string
}

export default function PaymentPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useAuth()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>("credit")
  const [installments, setInstallments] = useState<string>("1")
  const [cardNumber, setCardNumber] = useState<string>("")
  const [cardName, setCardName] = useState<string>("")
  const [expiryDate, setExpiryDate] = useState<string>("")
  const [cvv, setCvv] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [paymentComplete, setPaymentComplete] = useState<boolean>(false)
  const [movie, setMovie] = useState<any>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você precisa estar logado para acessar esta página.",
      })
      router.push(`/login?returnTo=/sessoes/${id}/pagamento`)
      return
    }

    // Recuperar dados do checkout do localStorage
    const storedData = localStorage.getItem("checkoutData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setCheckoutData(parsedData)

      // Buscar informações do filme
      if (parsedData.movieId) {
        const foundMovie = mockMovies.find((m) => m.id === parsedData.movieId)
        if (foundMovie) {
          setMovie(foundMovie)
        }
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível recuperar os dados da compra.",
      })
      router.push("/")
    }
  }, [id, isLoading, router, toast, user])

  const formatCardNumber = (value: string) => {
    // Remove todos os espaços e caracteres não numéricos
    const numbers = value.replace(/\D/g, "")
    // Adiciona espaço a cada 4 dígitos
    const formatted = numbers.replace(/(\d{4})(?=\d)/g, "$1 ")
    // Limita a 19 caracteres (16 números + 3 espaços)
    return formatted.slice(0, 19)
  }

  const formatExpiryDate = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "")
    // Adiciona / após os primeiros 2 dígitos
    if (numbers.length > 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`
    }
    return numbers
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value))
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limita a 3 ou 4 dígitos
    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
    setCvv(value)
  }

  const validateCardForm = () => {
    if (cardNumber.replace(/\s/g, "").length < 16) {
      toast({
        variant: "destructive",
        title: "Número de cartão inválido",
        description: "Por favor, insira um número de cartão válido.",
      })
      return false
    }

    if (!cardName) {
      toast({
        variant: "destructive",
        title: "Nome no cartão obrigatório",
        description: "Por favor, insira o nome como aparece no cartão.",
      })
      return false
    }

    if (expiryDate.length < 5) {
      toast({
        variant: "destructive",
        title: "Data de validade inválida",
        description: "Por favor, insira uma data de validade válida (MM/AA).",
      })
      return false
    }

    if (cvv.length < 3) {
      toast({
        variant: "destructive",
        title: "CVV inválido",
        description: "Por favor, insira um código de segurança válido.",
      })
      return false
    }

    return true
  }

  const handlePayment = () => {
    if (paymentMethod === "credit" || paymentMethod === "debit") {
      if (!validateCardForm()) return
    }

    setIsProcessing(true)

    // Simular processamento de pagamento
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentComplete(true)

      // Simular redirecionamento para página de ingressos após pagamento
      setTimeout(() => {
        // Limpar dados do checkout
        localStorage.removeItem("checkoutData")

        // Redirecionar para página de ingressos
        router.push("/meus-ingressos")

        toast({
          title: "Pagamento concluído!",
          description: "Seus ingressos estão disponíveis na área 'Meus Ingressos'.",
        })
      }, 2000)
    }, 3000)
  }

  if (isLoading || !checkoutData) {
    return (
      <div className="container py-12 flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-6">
        <Link href={`/sessoes/${id}/assentos`} className="flex items-center text-primary hover:underline mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para seleção de assentos
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold">Pagamento</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {paymentComplete ? (
            <Card className="border-green-500">
              <CardContent className="pt-6 flex flex-col items-center justify-center text-center p-12">
                <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Pagamento concluído com sucesso!</h2>
                <p className="text-muted-foreground mb-6">
                  Seus ingressos já estão disponíveis na área "Meus Ingressos".
                </p>
                <Button asChild size="lg">
                  <Link href="/meus-ingressos">Ver meus ingressos</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Escolha a forma de pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod}>
                  <TabsList className="grid grid-cols-3 mb-8">
                    <TabsTrigger value="credit">Crédito</TabsTrigger>
                    <TabsTrigger value="debit">Débito</TabsTrigger>
                    <TabsTrigger value="pix">PIX</TabsTrigger>
                  </TabsList>

                  <TabsContent value="credit">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="card-number">Número do cartão</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="card-number"
                              placeholder="0000 0000 0000 0000"
                              className="pl-10"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="card-name">Nome no cartão</Label>
                          <Input
                            id="card-name"
                            placeholder="Nome como aparece no cartão"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Validade</Label>
                            <Input
                              id="expiry"
                              placeholder="MM/AA"
                              value={expiryDate}
                              onChange={handleExpiryDateChange}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" value={cvv} onChange={handleCvvChange} maxLength={4} />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="installments">Parcelamento</Label>
                          <Select value={installments} onValueChange={setInstallments}>
                            <SelectTrigger id="installments">
                              <SelectValue placeholder="Selecione o número de parcelas" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                À vista - R$ {checkoutData.totalPrice.toFixed(2).replace(".", ",")}
                              </SelectItem>
                              <SelectItem value="2">
                                2x de R$ {(checkoutData.totalPrice / 2).toFixed(2).replace(".", ",")}
                              </SelectItem>
                              <SelectItem value="3">
                                3x de R$ {(checkoutData.totalPrice / 3).toFixed(2).replace(".", ",")}
                              </SelectItem>
                              <SelectItem value="4">
                                4x de R$ {(checkoutData.totalPrice / 4).toFixed(2).replace(".", ",")}
                              </SelectItem>
                              <SelectItem value="5">
                                5x de R$ {(checkoutData.totalPrice / 5).toFixed(2).replace(".", ",")}
                              </SelectItem>
                              <SelectItem value="6">
                                6x de R$ {(checkoutData.totalPrice / 6).toFixed(2).replace(".", ",")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="debit">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="debit-card-number">Número do cartão</Label>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="debit-card-number"
                              placeholder="0000 0000 0000 0000"
                              className="pl-10"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              maxLength={19}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="debit-card-name">Nome no cartão</Label>
                          <Input
                            id="debit-card-name"
                            placeholder="Nome como aparece no cartão"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="debit-expiry">Validade</Label>
                            <Input
                              id="debit-expiry"
                              placeholder="MM/AA"
                              value={expiryDate}
                              onChange={handleExpiryDateChange}
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="debit-cvv">CVV</Label>
                            <Input
                              id="debit-cvv"
                              placeholder="123"
                              value={cvv}
                              onChange={handleCvvChange}
                              maxLength={4}
                            />
                          </div>
                        </div>

                        <div className="p-4 bg-primary/10 rounded-md">
                          <p className="text-sm text-muted-foreground">
                            O valor total de R$ {checkoutData.totalPrice.toFixed(2).replace(".", ",")} será debitado da
                            sua conta.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="pix">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <div className="bg-white p-4 rounded-lg mb-6 flex items-center justify-center">
                        <QRCode 
                          value="00020126510014BR.GOV.BCB.PIX0129marceloborgesjr2000@gmail.com52040000530398654040.015802BR5925Marcelo Borges de Oliveir6009SAO PAULO62140510b9OuaUdOJC6304FF28"
                          size={192}
                          level="H" // Nível de correção de erro (L, M, Q, H)
                          bgColor="#ffffff"
                          fgColor="#000000"
                        />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Pague com PIX</h3>
                      <p className="text-muted-foreground mb-4">
                        Escaneie o QR Code acima com o aplicativo do seu banco ou copie o código abaixo.
                      </p>
                      <div className="flex w-full max-w-md mb-6">
                        <Input
                          readOnly
                          value="00020126580014br.gov.bcb.pix0136a629534e-7693-4846-b028-f142082d7b5752040000530398654041.005802BR5909CineXplor6008Sao Paulo62090505123456304E2CA00020126510014BR.GOV.BCB.PIX0129marceloborgesjr2000@gmail.com52040000530398654040.015802BR5925Marcelo Borges de Oliveir6009SAO PAULO62140510b9OuaUdOJC6304FF28"
                          className="rounded-r-none"
                        />
                        <Button
                          variant="secondary"
                          className="rounded-l-none"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              "00020126510014BR.GOV.BCB.PIX0129marceloborgesjr2000@gmail.com52040000530398654040.015802BR5925Marcelo Borges de Oliveir6009SAO PAULO62140510b9OuaUdOJC6304FF28",
                            )
                            toast({
                              title: "Código copiado!",
                              description: "O código PIX foi copiado para a área de transferência.",
                            })
                          }}
                        >
                          Copiar
                        </Button>
                      </div>
                      <div className="p-4 bg-primary/10 rounded-md w-full max-w-md">
                        <p className="text-sm text-muted-foreground">
                          Após o pagamento, o sistema atualizará automaticamente em até 1 minuto. Não feche esta página
                          até a confirmação.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handlePayment} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando pagamento...
                    </>
                  ) : (
                    `Pagar R$ ${checkoutData.totalPrice.toFixed(2).replace(".", ",")}`
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumo da compra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-14 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={movie?.posterUrl || "/placeholder.svg?height=450&width=300"}
                    alt={checkoutData.movieTitle || "Filme"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{checkoutData.movieTitle}</h3>
                  <p className="text-sm text-muted-foreground">{checkoutData.roomName}</p>
                  <p className="text-sm text-muted-foreground">
                    {checkoutData.date?.split("-").reverse().join("/")} às {checkoutData.time}
                  </p>
                  <p className="text-sm text-muted-foreground">{checkoutData.cinemaName}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Ingressos selecionados</h3>

                {checkoutData.selectedSeats.map((seat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md border flex items-center justify-center">
                        {seat.row}
                        {seat.number}
                      </div>
                      <span className="capitalize">
                        {checkoutData.ticketTypes[`${seat.row}-${seat.number}`] || "Inteira"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        R${" "}
                        {(checkoutData.ticketTypes[`${seat.row}-${seat.number}`] === "meia"
                          ? (checkoutData.totalPrice / checkoutData.selectedSeats.length) * 0.5
                          : checkoutData.totalPrice / checkoutData.selectedSeats.length
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="font-semibold">Total</p>
                  <p className="text-xl font-bold">R$ {checkoutData.totalPrice.toFixed(2).replace(".", ",")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
