export interface Movie {
  id: string
  title: string
  synopsis: string
  posterUrl: string
  backdropUrl?: string
  trailerUrl?: string
  duration: number
  releaseDate: string
  classification: string
  genres: string[]
  rating?: number
  isComingSoon?: boolean
}

export interface Cinema {
  id: string
  name: string
  address: string
  imageUrl: string
  roomTypes: string[]
  rating: number
  reviewCount: number
  location?: {
    lat: number
    lng: number
  }
}

export interface Session {
  id: string
  movieId: string
  cinemaId: string
  roomId: string
  roomName: string
  roomType: string
  date: string
  time: string
  price: number
  availableSeats: number
  totalSeats: number
}

export interface Room {
  id: string
  name: string
  cinemaId: string
  type: string
  rows: number
  seatsPerRow: number
  totalSeats: number
}

export interface Seat {
  id: string
  row: string
  number: number
  status: "available" | "occupied" | "selected"
  type: "standard" | "premium" | "accessible"
}

export interface Ticket {
  id: string
  sessionId: string
  movieTitle: string
  cinemaName: string
  roomName: string
  date: string
  time: string
  seats: {
    row: string
    number: number
  }[]
  ticketType: "inteira" | "meia" | "promocional"
  price: number
  qrCode: string
  purchaseDate: string
  userId: string
}

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}
