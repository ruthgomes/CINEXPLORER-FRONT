"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { MapPin, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CadastrarEndereco() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    cep: "",
    estado: "",
    cidade: "",
    bairro: "",
    rua: "",
    numero: "",
    complemento: "",
  })

  const estados = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCepChange = async (cep: string) => {
    setFormData((prev) => ({ ...prev, cep }))

    // Remove caracteres não numéricos
    const cleanCep = cep.replace(/\D/g, "")

    if (cleanCep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        const data = await response.json()

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            estado: data.uf,
            cidade: data.localidade,
            bairro: data.bairro,
            rua: data.logradouro,
          }))

          toast({
            title: "CEP encontrado",
            description: "Endereço preenchido automaticamente.",
          })
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validação básica
    if (!formData.cep || !formData.estado || !formData.cidade || !formData.rua || !formData.numero) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
      })
      setIsLoading(false)
      return
    }

    try {
      // Simular salvamento do endereço
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Salvar endereço no localStorage
      const endereco = `${formData.rua}, ${formData.numero} - ${formData.bairro}, ${formData.cidade} - ${formData.estado}`
      localStorage.setItem("userLocation", endereco)
      localStorage.setItem("userAddress", JSON.stringify(formData))

      // Simular cálculo de coordenadas (em um app real, usaria geocoding)
      const mockCoordinates = {
        lat: -23.5505 + (Math.random() - 0.5) * 0.1,
        lng: -46.6333 + (Math.random() - 0.5) * 0.1,
      }
      localStorage.setItem("userCoordinates", JSON.stringify(mockCoordinates))

      toast({
        title: "Endereço cadastrado",
        description: "Seu endereço foi salvo com sucesso. Redirecionando...",
      })

      setTimeout(() => {
        router.push("/")
      }, 1500)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao salvar seu endereço. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-primary">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao início
            </Link>
          </Button>
        </div>

        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Cadastrar Endereço</CardTitle>
            <CardDescription>
              Informe seu endereço completo para encontrarmos os cinemas mais próximos de você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP *</Label>
                  <Input
                    id="cep"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    maxLength={9}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado *</Label>
                  <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    placeholder="Nome da cidade"
                    value={formData.cidade}
                    onChange={(e) => handleInputChange("cidade", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    placeholder="Nome do bairro"
                    value={formData.bairro}
                    onChange={(e) => handleInputChange("bairro", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rua">Rua/Logradouro *</Label>
                <Input
                  id="rua"
                  placeholder="Nome da rua"
                  value={formData.rua}
                  onChange={(e) => handleInputChange("rua", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numero">Número *</Label>
                  <Input
                    id="numero"
                    placeholder="123"
                    value={formData.numero}
                    onChange={(e) => handleInputChange("numero", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complemento">Complemento</Label>
                  <Input
                    id="complemento"
                    placeholder="Apto, bloco, etc."
                    value={formData.complemento}
                    onChange={(e) => handleInputChange("complemento", e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Endereço"}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <h3 className="font-medium mb-2">Por que precisamos do seu endereço?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Mostrar cinemas próximos à sua localização</li>
                <li>• Calcular distâncias e tempos de deslocamento</li>
                <li>• Oferecer promoções específicas da sua região</li>
                <li>• Melhorar sua experiência de navegação</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
