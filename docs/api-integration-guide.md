# Guia de Integração com API - Sistema Cinema v21

Este documento contém todas as informações necessárias para substituir os dados mock por chamadas reais de API.

## 📁 Estrutura de Pastas Recomendada

\`\`\`
lib/
├── api/
│   ├── auth.ts          # Funções de autenticação
│   ├── movies.ts        # Funções relacionadas a filmes
│   ├── cinemas.ts       # Funções relacionadas a cinemas
│   ├── sessions.ts      # Funções relacionadas a sessões
│   ├── tickets.ts       # Funções relacionadas a ingressos
│   ├── payments.ts      # Funções relacionadas a pagamentos
│   ├── promotions.ts    # Funções relacionadas a promoções
│   ├── admin.ts         # Funções administrativas
│   └── client.ts        # Cliente HTTP configurado
├── hooks/
│   ├── use-movies.ts    # Hooks para filmes
│   ├── use-cinemas.ts   # Hooks para cinemas
│   ├── use-sessions.ts  # Hooks para sessões
│   └── use-auth.ts      # Hooks para autenticação
└── types/
    └── api.ts           # Tipos específicos da API
\`\`\`

---

## 🔐 1. AUTENTICAÇÃO

### 📄 Arquivo: `components/auth-provider.tsx`

**🔍 LOCALIZAR (Linha ~35-60):**
\`\`\`typescript
const login = async (email: string, password: string) => {
  setIsLoading(true)
  await new Promise((resolve) => setTimeout(resolve, 1000))
  
  if (email === "admin@example.com" && password === "password") {
    const userData = {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      role: "admin" as const,
    }
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoading(false)
    return true
  }
  
  if (email === "user@example.com" && password === "password") {
    const userData = {
      id: "2",
      name: "Regular User",
      email: "user@example.com",
      role: "user" as const,
    }
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    setIsLoading(false)
    return true
  }
  
  setIsLoading(false)
  return false
}
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const login = async (email: string, password: string) => {
  setIsLoading(true)
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    
    if (response.ok) {
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)
      setIsLoading(false)
      return true
    } else {
      setIsLoading(false)
      return false
    }
  } catch (error) {
    console.error('Login error:', error)
    setIsLoading(false)
    return false
  }
}
\`\`\`

**🔍 LOCALIZAR (Linha ~80-90):**
\`\`\`typescript
const logout = () => {
  setUser(null)
  localStorage.removeItem("user")
}
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const logout = async () => {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  }
}
\`\`\`

**📡 Endpoints necessários:**
- `POST /api/auth/login` - Login do usuário
- `POST /api/auth/logout` - Logout do usuário
- `GET /api/auth/me` - Verificar usuário logado

---

## 🎬 2. FILMES

### 📄 Arquivo: `app/em-cartaz/page.tsx`

**🔍 LOCALIZAR (Linha ~20):**
\`\`\`typescript
// Filter movies that are not coming soon
const currentMovies = mockMovies.filter((movie) => !movie.isComingSoon)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const [currentMovies, setCurrentMovies] = useState<Movie[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchCurrentMovies = async () => {
    try {
      const response = await fetch('/api/movies?status=current')
      const data = await response.json()
      setCurrentMovies(data.movies || data)
    } catch (error) {
      console.error('Error fetching current movies:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchCurrentMovies()
}, [])
\`\`\`

### 📄 Arquivo: `app/em-breve/page.tsx`

**🔍 LOCALIZAR (Linha ~20):**
\`\`\`typescript
// Filter movies that are coming soon
const comingSoonMovies = mockMovies.filter((movie) => movie.isComingSoon)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const [comingSoonMovies, setComingSoonMovies] = useState<Movie[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchComingSoonMovies = async () => {
    try {
      const response = await fetch('/api/movies?status=coming-soon')
      const data = await response.json()
      setComingSoonMovies(data.movies || data)
    } catch (error) {
      console.error('Error fetching coming soon movies:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchComingSoonMovies()
}, [])
\`\`\`

### 📄 Arquivo: `app/filmes/[id]/page.tsx`

**🔍 LOCALIZAR (Linha ~25-40):**
\`\`\`typescript
useEffect(() => {
  // Find the movie by ID
  const foundMovie = mockMovies.find((m) => m.id === id)
  if (foundMovie) {
    setMovie(foundMovie)

    // Find similar movies (same genre)
    const similar = mockMovies
      .filter((m) => m.id !== id && m.genres.some((g) => foundMovie.genres.includes(g)))
      .slice(0, 4)
    setSimilarMovies(similar)

    // Find sessions for this movie filtered by selected date
    const movieSessions = expandedMockSessions.filter((s) => s.movieId === id && s.date === selectedDate)
    setSessions(movieSessions)
  }
}, [id, selectedDate])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  const fetchMovieData = async () => {
    if (!id) return
    
    try {
      // Buscar dados do filme
      const movieResponse = await fetch(`/api/movies/${id}`)
      const movieData = await movieResponse.json()
      setMovie(movieData)
      
      // Buscar filmes similares
      const similarResponse = await fetch(`/api/movies/${id}/similar`)
      const similarData = await similarResponse.json()
      setSimilarMovies(similarData.slice(0, 4))
      
    } catch (error) {
      console.error('Error fetching movie data:', error)
    }
  }
  
  fetchMovieData()
}, [id])

useEffect(() => {
  const fetchSessions = async () => {
    if (!id || !selectedDate) return
    
    try {
      const response = await fetch(`/api/movies/${id}/sessions?date=${selectedDate}`)
      const data = await response.json()
      setSessions(data)
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }
  
  fetchSessions()
}, [id, selectedDate])
\`\`\`

### 📄 Arquivo: `app/filmes/[id]/ingressos/page.tsx`

**🔍 LOCALIZAR (Linha ~15-25):**
\`\`\`typescript
useEffect(() => {
  // Find the movie by ID
  const foundMovie = mockMovies.find((m) => m.id === id)
  if (foundMovie) {
    setMovie(foundMovie)

    // Find sessions for this movie
    const movieSessions = mockSessions.filter((s) => s.movieId === id)
    setSessions(movieSessions)
  } else {
    // Movie not found, redirect to movies page
    router.push("/em-cartaz")
  }
}, [id, router])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  const fetchMovieAndSessions = async () => {
    if (!id) return
    
    try {
      // Buscar dados do filme
      const movieResponse = await fetch(`/api/movies/${id}`)
      if (!movieResponse.ok) {
        router.push("/em-cartaz")
        return
      }
      const movieData = await movieResponse.json()
      setMovie(movieData)
      
      // Buscar sessões do filme
      const sessionsResponse = await fetch(`/api/movies/${id}/sessions`)
      const sessionsData = await sessionsResponse.json()
      setSessions(sessionsData)
      
    } catch (error) {
      console.error('Error fetching movie and sessions:', error)
      router.push("/em-cartaz")
    }
  }
  
  fetchMovieAndSessions()
}, [id, router])
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/movies?status=current` - Filmes em cartaz
- `GET /api/movies?status=coming-soon` - Filmes em breve
- `GET /api/movies/{id}` - Detalhes de um filme
- `GET /api/movies/{id}/similar` - Filmes similares
- `GET /api/movies/{id}/sessions` - Sessões de um filme

---

## 🏢 3. CINEMAS

### 📄 Arquivo: `app/cinemas/page.tsx`

**🔍 LOCALIZAR (Linha ~25-45):**
\`\`\`typescript
useEffect(() => {
  const userCoordinates = localStorage.getItem("userCoordinates")
  const locationShared = localStorage.getItem("locationShared")

  if (locationShared === "true" && userCoordinates) {
    const coords = JSON.parse(userCoordinates)

    // Calcular distância e ordenar cinemas
    const cinemasWithDistance = mockCinemas
      .map((cinema) => ({
        ...cinema,
        distance: calculateDistance(coords.lat, coords.lng, cinema.location.lat, cinema.location.lng),
      }))
      .sort((a, b) => a.distance - b.distance)

    setFilteredCinemas(cinemasWithDistance)
  } else {
    // Mostrar todos os cinemas se localização não foi compartilhada
    setFilteredCinemas(mockCinemas)
  }
}, [])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  const fetchCinemas = async () => {
    try {
      const userCoordinates = localStorage.getItem("userCoordinates")
      const locationShared = localStorage.getItem("locationShared")
      
      let url = '/api/cinemas'
      
      if (locationShared === "true" && userCoordinates) {
        const coords = JSON.parse(userCoordinates)
        url += `?lat=${coords.lat}&lng=${coords.lng}&sort=distance`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      setFilteredCinemas(data.cinemas || data)
      
    } catch (error) {
      console.error('Error fetching cinemas:', error)
    }
  }
  
  fetchCinemas()
}, [])
\`\`\`

### 📄 Arquivo: `app/cinemas/[id]/page.tsx`

**🔍 LOCALIZAR (Linha ~15-30):**
\`\`\`typescript
useEffect(() => {
  // Find the cinema by ID
  const foundCinema = mockCinemas.find((c) => c.id === id)
  if (foundCinema) {
    setCinema(foundCinema)

    // Find rooms for this cinema
    const cinemaRooms = mockRooms.filter((r) => r.cinemaId === id)
    setRooms(cinemaRooms)

    // Find sessions for this cinema
    const cinemaSessions = mockSessions.filter((s) => s.cinemaId === id)
    setSessions(cinemaSessions)
  } else {
    // Cinema not found, redirect to cinemas page
    router.push("/cinemas")
  }
}, [id, router])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  const fetchCinemaData = async () => {
    if (!id) return
    
    try {
      // Buscar dados do cinema
      const cinemaResponse = await fetch(`/api/cinemas/${id}`)
      if (!cinemaResponse.ok) {
        router.push("/cinemas")
        return
      }
      const cinemaData = await cinemaResponse.json()
      setCinema(cinemaData)
      
      // Buscar salas do cinema
      const roomsResponse = await fetch(`/api/cinemas/${id}/rooms`)
      const roomsData = await roomsResponse.json()
      setRooms(roomsData)
      
      // Buscar sessões do cinema
      const sessionsResponse = await fetch(`/api/cinemas/${id}/sessions`)
      const sessionsData = await sessionsResponse.json()
      setSessions(sessionsData)
      
    } catch (error) {
      console.error('Error fetching cinema data:', error)
      router.push("/cinemas")
    }
  }
  
  fetchCinemaData()
}, [id, router])
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/cinemas` - Listar cinemas
- `GET /api/cinemas?lat={lat}&lng={lng}&sort=distance` - Cinemas por localização
- `GET /api/cinemas/{id}` - Detalhes de um cinema
- `GET /api/cinemas/{id}/rooms` - Salas de um cinema
- `GET /api/cinemas/{id}/sessions` - Sessões de um cinema

---

## 🎫 4. SESSÕES E ASSENTOS

### 📄 Arquivo: `app/sessoes/[id]/assentos/page.tsx`

**🔍 LOCALIZAR (Linha ~20-40):**
\`\`\`typescript
useEffect(() => {
  // Find session by ID
  const foundSession = mockSessions.find((s) => s.id === id)
  if (foundSession) {
    setSession(foundSession)

    // Find related data
    const foundMovie = mockMovies.find((m) => m.id === foundSession.movieId)
    const foundCinema = mockCinemas.find((c) => c.id === foundSession.cinemaId)
    const foundRoom = mockRooms.find((r) => r.id === foundSession.roomId)

    if (foundMovie) setMovie(foundMovie)
    if (foundCinema) setCinema(foundCinema)
    if (foundRoom) {
      setRoom(foundRoom)
      // Generate mock seats
      const generatedSeats = generateMockSeats(foundSession.id, foundRoom.rows, foundRoom.seatsPerRow)
      setSeats(generatedSeats)
    }
  }
}, [id])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  const fetchSessionData = async () => {
    if (!id) return
    
    try {
      // Buscar dados da sessão
      const sessionResponse = await fetch(`/api/sessions/${id}`)
      const sessionData = await sessionResponse.json()
      setSession(sessionData)
      
      // Buscar dados do filme
      const movieResponse = await fetch(`/api/movies/${sessionData.movieId}`)
      const movieData = await movieResponse.json()
      setMovie(movieData)
      
      // Buscar dados do cinema
      const cinemaResponse = await fetch(`/api/cinemas/${sessionData.cinemaId}`)
      const cinemaData = await cinemaResponse.json()
      setCinema(cinemaData)
      
      // Buscar dados da sala
      const roomResponse = await fetch(`/api/rooms/${sessionData.roomId}`)
      const roomData = await roomResponse.json()
      setRoom(roomData)
      
      // Buscar assentos da sessão
      const seatsResponse = await fetch(`/api/sessions/${id}/seats`)
      const seatsData = await seatsResponse.json()
      setSeats(seatsData)
      
    } catch (error) {
      console.error('Error fetching session data:', error)
    }
  }
  
  fetchSessionData()
}, [id])
\`\`\`

**🔍 LOCALIZAR função handleCheckout (Linha ~100-150):**
\`\`\`typescript
const handleCheckout = () => {
  // ... validações existentes ...
  
  // Salvar dados da seleção no localStorage
  localStorage.setItem(
    "checkoutData",
    JSON.stringify({
      sessionId: id,
      movieId: movie?.id,
      cinemaId: cinema?.id,
      selectedSeats: selectedSeats,
      ticketTypes: ticketTypes,
      totalPrice: calculateTotal(),
      movieTitle: movie?.title,
      cinemaName: cinema?.name,
      roomName: session?.roomName,
      date: session?.date,
      time: session?.time,
    }),
  )

  router.push(`/sessoes/${id}/pagamento`)
}
\`\`\`

**🔄 ADICIONAR antes do localStorage:**
\`\`\`typescript
const handleCheckout = async () => {
  // ... validações existentes ...
  
  try {
    // Reservar assentos temporariamente
    const reserveResponse = await fetch(`/api/sessions/${id}/reserve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        seats: selectedSeats.map(seat => ({ row: seat.row, number: seat.number })),
        ticketTypes: ticketTypes,
      }),
    })
    
    if (!reserveResponse.ok) {
      throw new Error('Failed to reserve seats')
    }
    
    const reserveData = await reserveResponse.json()
    
    // Salvar dados da seleção no localStorage
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        sessionId: id,
        reservationId: reserveData.reservationId,
        movieId: movie?.id,
        cinemaId: cinema?.id,
        selectedSeats: selectedSeats,
        ticketTypes: ticketTypes,
        totalPrice: calculateTotal(),
        movieTitle: movie?.title,
        cinemaName: cinema?.name,
        roomName: session?.roomName,
        date: session?.date,
        time: session?.time,
      }),
    )

    router.push(`/sessoes/${id}/pagamento`)
    
  } catch (error) {
    console.error('Error reserving seats:', error)
    toast({
      variant: "destructive",
      title: "Erro ao reservar assentos",
      description: "Não foi possível reservar os assentos selecionados. Tente novamente.",
    })
  }
}
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/sessions/{id}` - Detalhes de uma sessão
- `GET /api/sessions/{id}/seats` - Assentos de uma sessão
- `POST /api/sessions/{id}/reserve` - Reservar assentos temporariamente
- `GET /api/rooms/{id}` - Detalhes de uma sala

---

## 💳 5. PAGAMENTO

### 📄 Arquivo: `app/sessoes/[id]/pagamento/page.tsx`

**🔍 LOCALIZAR função handlePayment (Linha ~150-170):**
\`\`\`typescript
const handlePayment = () => {
  setIsProcessing(true)
  
  setTimeout(() => {
    setIsProcessing(false)
    setPaymentComplete(true)
    
    setTimeout(() => {
      localStorage.removeItem("checkoutData")
      router.push("/meus-ingressos")
    }, 2000)
  }, 3000)
}
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const handlePayment = async () => {
  setIsProcessing(true)
  
  try {
    const paymentData = {
      sessionId: checkoutData.sessionId,
      reservationId: checkoutData.reservationId,
      seats: checkoutData.selectedSeats.map(seat => ({ 
        row: seat.row, 
        number: seat.number 
      })),
      ticketTypes: checkoutData.ticketTypes,
      totalAmount: checkoutData.totalPrice,
      paymentMethod: paymentMethod,
      paymentDetails: {
        cardNumber: paymentMethod !== 'pix' ? cardNumber : undefined,
        cardName: paymentMethod !== 'pix' ? cardName : undefined,
        expiryDate: paymentMethod !== 'pix' ? expiryDate : undefined,
        cvv: paymentMethod !== 'pix' ? cvv : undefined,
        installments: paymentMethod === 'credit' ? installments : undefined,
      }
    }
    
    const response = await fetch('/api/payments/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(paymentData),
    })
    
    if (response.ok) {
      const result = await response.json()
      
      if (paymentMethod === 'pix') {
        setPixData({
          qrCode: result.pixQrCode,
          code: result.pixCode,
        })
      }
      
      setPaymentComplete(true)
      
      // Salvar ID da compra para buscar ingressos depois
      localStorage.setItem('lastPurchaseId', result.purchaseId)
      
      setTimeout(() => {
        localStorage.removeItem("checkoutData")
        router.push("/meus-ingressos")
      }, 2000)
    } else {
      throw new Error('Payment failed')
    }
  } catch (error) {
    console.error('Payment error:', error)
    toast({
      variant: "destructive",
      title: "Erro no pagamento",
      description: "Ocorreu um erro ao processar o pagamento. Tente novamente.",
    })
  } finally {
    setIsProcessing(false)
  }
}
\`\`\`

**📡 Endpoints necessários:**
- `POST /api/payments/process` - Processar pagamento
- `GET /api/payments/{id}/status` - Status do pagamento
- `POST /api/payments/pix/generate` - Gerar QR Code PIX

---

## 🎟️ 6. INGRESSOS

### 📄 Arquivo: `app/meus-ingressos/page.tsx`

**🔍 LOCALIZAR (Linha ~20-35):**
\`\`\`typescript
useEffect(() => {
  if (!isLoading && (!user || user.role !== "user")) {
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Você precisa estar logado para acessar esta página.",
    })
    router.push("/login")
    return
  }

  if (user) {
    const userTickets = mockTickets.filter((ticket) => ticket.userId === user.id)
    setTickets(userTickets)
  }
}, [user, isLoading, router, toast])
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
useEffect(() => {
  if (!isLoading && !user) {
    toast({
      variant: "destructive",
      title: "Acesso negado",
      description: "Você precisa estar logado para acessar esta página.",
    })
    router.push("/login")
    return
  }

  const fetchTickets = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/tickets', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      })
      
      if (response.ok) {
        const ticketsData = await response.json()
        setTickets(ticketsData.tickets || ticketsData)
      }
    } catch (error) {
      console.error('Error fetching tickets:', error)
    }
  }
  
  if (user) {
    fetchTickets()
  }
}, [user, isLoading, router, toast])
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/tickets` - Listar ingressos do usuário
- `GET /api/tickets/{id}` - Detalhes de um ingresso
- `GET /api/tickets/{id}/qrcode` - QR Code do ingresso

---

## 🔍 7. BUSCA

### 📄 Arquivo: `components/header.tsx`

**🔍 LOCALIZAR (Linha ~50-80):**
\`\`\`typescript
const filteredMovies = mockMovies.filter((movie) =>
  movie.title.toLowerCase().includes(searchQuery.toLowerCase())
).slice(0, 3)

const filteredCinemas = mockCinemas.filter((cinema) =>
  cinema.name.toLowerCase().includes(searchQuery.toLowerCase())
).slice(0, 3)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const [searchResults, setSearchResults] = useState({
  movies: [],
  cinemas: [],
  promotions: []
})

useEffect(() => {
  const searchTimeout = setTimeout(async () => {
    if (searchQuery.length > 2) {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const results = await response.json()
        setSearchResults(results)
      } catch (error) {
        console.error('Search error:', error)
        setSearchResults({ movies: [], cinemas: [], promotions: [] })
      }
    } else {
      setSearchResults({ movies: [], cinemas: [], promotions: [] })
    }
  }, 300)

  return () => clearTimeout(searchTimeout)
}, [searchQuery])

// Usar searchResults.movies e searchResults.cinemas no JSX
const filteredMovies = searchResults.movies.slice(0, 3)
const filteredCinemas = searchResults.cinemas.slice(0, 3)
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/search?q={query}` - Busca global (filmes, cinemas, promoções)

---

## 📍 8. LOCALIZAÇÃO

### 📄 Arquivo: `app/cadastrar-endereco/page.tsx`

**🔍 LOCALIZAR função handleSubmit (Linha ~80-100):**
\`\`\`typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Validate required fields
  if (!formData.cep || !formData.estado || !formData.cidade || !formData.bairro || !formData.rua || !formData.numero) {
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: "Por favor, preencha todos os campos obrigatórios.",
    })
    setIsLoading(false)
    return
  }

  // Mock API call - replace with real API
  setTimeout(() => {
    const endereco = `${formData.rua}, ${formData.numero}${formData.complemento ? `, ${formData.complemento}` : ""}, ${formData.bairro}, ${formData.cidade} - ${formData.estado}, ${formData.cep}`

    localStorage.setItem("userLocation", endereco)
    localStorage.setItem("userAddress", JSON.stringify(formData))

    toast({
      title: "Endereço cadastrado",
      description: "Seu endereço foi salvo com sucesso.",
    })

    setIsLoading(false)
    router.push("/")
  }, 1000)
}
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)

  // Validate required fields
  if (!formData.cep || !formData.estado || !formData.cidade || !formData.bairro || !formData.rua || !formData.numero) {
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: "Por favor, preencha todos os campos obrigatórios.",
    })
    setIsLoading(false)
    return
  }

  try {
    const response = await fetch('/api/user/address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    })
    
    if (response.ok) {
      const result = await response.json()
      
      localStorage.setItem("userLocation", result.formattedAddress)
      localStorage.setItem("userAddress", JSON.stringify(formData))
      localStorage.setItem("userCoordinates", JSON.stringify(result.coordinates))
      
      toast({
        title: "Endereço cadastrado",
        description: "Seu endereço foi salvo com sucesso.",
      })
      
      router.push("/")
    } else {
      throw new Error('Failed to save address')
    }
  } catch (error) {
    console.error('Error saving address:', error)
    toast({
      variant: "destructive",
      title: "Erro no cadastro",
      description: "Não foi possível salvar o endereço. Tente novamente.",
    })
  } finally {
    setIsLoading(false)
  }
}
\`\`\`

**📡 Endpoints necessários:**
- `POST /api/user/address` - Salvar endereço do usuário
- `GET /api/geocoding/address` - Converter endereço em coordenadas

---

## 👨‍💼 9. ADMIN - FILMES

### 📄 Arquivo: `app/admin/filmes/page.tsx`

**🔍 LOCALIZAR (Linha ~25):**
\`\`\`typescript
// Load movies
setMovies(mockMovies)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const fetchMovies = async () => {
  try {
    const response = await fetch('/api/admin/movies', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const moviesData = await response.json()
    setMovies(moviesData.movies || moviesData)
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

fetchMovies()
\`\`\`

**🔍 LOCALIZAR função handleDeleteConfirm (Linha ~50-60):**
\`\`\`typescript
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
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const handleDeleteConfirm = async () => {
  if (!movieToDelete) return
  
  try {
    const response = await fetch(`/api/admin/movies/${movieToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    
    if (response.ok) {
      setMovies(movies.filter((m) => m.id !== movieToDelete.id))
      
      toast({
        title: "Filme excluído",
        description: `O filme "${movieToDelete.title}" foi excluído com sucesso.`,
      })
    } else {
      throw new Error('Failed to delete movie')
    }
  } catch (error) {
    console.error('Error deleting movie:', error)
    toast({
      variant: "destructive",
      title: "Erro ao excluir",
      description: "Não foi possível excluir o filme. Tente novamente.",
    })
  } finally {
    setDeleteDialogOpen(false)
    setMovieToDelete(null)
  }
}
\`\`\`

### 📄 Arquivo: `app/admin/filmes/[id]/page.tsx`

**🔍 LOCALIZAR (Linha ~40-60):**
\`\`\`typescript
// Load movie data
if (id === "novo") {
  // Creating a new movie
  setMovie({
    id: `new-${Date.now()}`,
    title: "",
    synopsis: "",
    posterUrl: "/placeholder.svg?height=450&width=300",
    backdropUrl: "/placeholder.svg?height=1080&width=1920",
    trailerUrl: "",
    duration: 120,
    releaseDate: new Date().toLocaleDateString("pt-BR"),
    classification: "14 anos",
    genres: ["Ação"],
    rating: 0,
    isComingSoon: false,
  })
  setIsLoading(false)
} else {
  // Editing an existing movie
  const foundMovie = mockMovies.find((m) => m.id === id)
  if (foundMovie) {
    setMovie(foundMovie)
  } else {
    toast({
      variant: "destructive",
      title: "Filme não encontrado",
      description: "O filme que você está tentando editar não foi encontrado.",
    })
    router.push("/admin/filmes")
  }
  setIsLoading(false)
}
\`\` não foi encontrado.",
    })
    router.push("/admin/filmes")
  }
  setIsLoading(false)
}

fetchMovieData()
\`\`\`

**🔍 LOCALIZAR função handleSubmit (Linha ~100-120):**
\`\`\`typescript
// In a real app, this would call an API to save the movie
setTimeout(() => {
  toast({
    title: "Filme salvo",
    description: `O filme "${movie.title}" foi salvo com sucesso.`,
  })
  setIsSaving(false)
  router.push("/admin/filmes")
}, 1000)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
try {
  const method = id === "novo" ? 'POST' : 'PUT'
  const url = id === "novo" ? '/api/admin/movies' : `/api/admin/movies/${id}`
  
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(movie),
  })
  
  if (response.ok) {
    toast({
      title: "Filme salvo",
      description: `O filme "${movie.title}" foi salvo com sucesso.`,
    })
    router.push("/admin/filmes")
  } else {
    throw new Error('Failed to save movie')
  }
} catch (error) {
  console.error('Error saving movie:', error)
  toast({
    variant: "destructive",
    title: "Erro ao salvar",
    description: "Não foi possível salvar o filme. Tente novamente.",
  })
} finally {
  setIsSaving(false)
}
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/admin/movies` - Listar filmes (admin)
- `GET /api/admin/movies/{id}` - Buscar filme específico (admin)
- `POST /api/admin/movies` - Criar filme
- `PUT /api/admin/movies/{id}` - Atualizar filme
- `DELETE /api/admin/movies/{id}` - Deletar filme

---

## 🏢 10. ADMIN - CINEMAS

### 📄 Arquivo: `app/admin/cinemas/page.tsx`

**🔍 LOCALIZAR (Linha ~25):**
\`\`\`typescript
// Load cinemas
setCinemas(mockCinemas)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const fetchCinemas = async () => {
  try {
    const response = await fetch('/api/admin/cinemas', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const cinemasData = await response.json()
    setCinemas(cinemasData.cinemas || cinemasData)
  } catch (error) {
    console.error('Error fetching cinemas:', error)
  }
}

fetchCinemas()
\`\`\`

### 📄 Arquivo: `app/admin/sessoes/page.tsx`

**🔍 LOCALIZAR (Linha ~25):**
\`\`\`typescript
// Load sessions
setSessions(mockSessions)
\`\`\`

**🔄 SUBSTITUIR POR:**
\`\`\`typescript
const fetchSessions = async () => {
  try {
    const response = await fetch('/api/admin/sessions', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const sessionsData = await response.json()
    setSessions(sessionsData.sessions || sessionsData)
  } catch (error) {
    console.error('Error fetching sessions:', error)
  }
}

fetchSessions()
\`\`\`

**📡 Endpoints necessários:**
- `GET /api/admin/cinemas` - Listar cinemas (admin)
- `POST /api/admin/cinemas` - Criar cinema
- `PUT /api/admin/cinemas/{id}` - Atualizar cinema
- `DELETE /api/admin/cinemas/{id}` - Deletar cinema
- `GET /api/admin/sessions` - Listar sessões (admin)
- `POST /api/admin/sessions` - Criar sessão
- `PUT /api/admin/sessions/{id}` - Atualizar sessão
- `DELETE /api/admin/sessions/{id}` - Deletar sessão

---

## 📊 RESUMO COMPLETO DOS ENDPOINTS

### 🔐 Autenticação (3 endpoints)
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### 🎬 Filmes (4 endpoints)
- `GET /api/movies?status={status}`
- `GET /api/movies/{id}`
- `GET /api/movies/{id}/similar`
- `GET /api/movies/{id}/sessions`

### 🏢 Cinemas (4 endpoints)
- `GET /api/cinemas`
- `GET /api/cinemas/{id}`
- `GET /api/cinemas/{id}/rooms`
- `GET /api/cinemas/{id}/sessions`

### 🎫 Sessões (4 endpoints)
- `GET /api/sessions/{id}`
- `GET /api/sessions/{id}/seats`
- `POST /api/sessions/{id}/reserve`
- `GET /api/rooms/{id}`

### 💳 Pagamentos (3 endpoints)
- `POST /api/payments/process`
- `GET /api/payments/{id}/status`
- `POST /api/payments/pix/generate`

### 🎟️ Ingressos (3 endpoints)
- `GET /api/tickets`
- `GET /api/tickets/{id}`
- `GET /api/tickets/{id}/qrcode`

### 🔍 Busca (1 endpoint)
- `GET /api/search`

### 📍 Localização (2 endpoints)
- `POST /api/user/address`
- `GET /api/geocoding/address`

### 👨‍💼 Admin (12 endpoints)
- `GET /api/admin/movies`
- `GET /api/admin/movies/{id}`
- `POST /api/admin/movies`
- `PUT /api/admin/movies/{id}`
- `DELETE /api/admin/movies/{id}`
- `GET /api/admin/cinemas`
- `POST /api/admin/cinemas`
- `PUT /api/admin/cinemas/{id}`
- `DELETE /api/admin/cinemas/{id}`
- `GET /api/admin/sessions`
- `POST /api/admin/sessions`
- `PUT /api/admin/sessions/{id}`
- `DELETE /api/admin/sessions/{id}`

**TOTAL: 39 endpoints**

---

## 🔧 CONFIGURAÇÃO ADICIONAL NECESSÁRIA

### 📄 Arquivo: `.env.local`
\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Authentication
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Payment Gateway
PAYMENT_GATEWAY_API_KEY=your-payment-key
PAYMENT_GATEWAY_SECRET=your-payment-secret

# External APIs
VIACEP_API_URL=https://viacep.com.br/ws
GEOCODING_API_KEY=your-geocoding-key
\`\`\`

Este guia fornece todos os pontos exatos onde você deve fazer as substituições para integrar com sua API real. Cada seção mostra o código atual (mock) e como substituir por chamadas de API reais.
