import type { Movie, Cinema, Session, Room, Seat, Ticket } from "./types"

export const mockMovies: Movie[] = [
  {
    id: "1",
    title: "Duna: Parte 2",
    synopsis:
      "Paul Atreides se une a Chani e aos Fremen enquanto busca vingança contra os conspiradores que destruíram sua família. Enfrentando uma escolha entre o amor de sua vida e o destino do universo, ele deve evitar um futuro terrível que só ele pode prever.",
    posterUrl: "/duna-parte-dois.jpeg",
    backdropUrl: "/duna-parte-dois.jpeg",
    trailerUrl: "https://www.youtube.com/embed/Way9Dexny3w",
    duration: 166,
    releaseDate: "29/02/2024",
    classification: "14 anos",
    genres: ["Ficção Científica", "Aventura", "Drama"],
    rating: 8.7,
  },
  {
    id: "2",
    title: "Pobres Criaturas",
    synopsis:
      "A jovem Bella Baxter é trazida de volta à vida pelo brilhante e pouco ortodoxo cientista Dr. Godwin Baxter. Sob a proteção de Baxter, Bella está ansiosa para aprender. Desejando conhecer mais sobre o mundo, Bella foge com Duncan Wedderburn, um advogado astuto e debochado, em uma aventura por continentes.",
    posterUrl: "/pobres-criaturas.jpg",
    backdropUrl: "/pobres-criaturas.jpg",
    trailerUrl: "https://www.youtube.com/embed/RlbR5N6veqw",
    duration: 141,
    releaseDate: "01/02/2024",
    classification: "18 anos",
    genres: ["Drama", "Ficção Científica", "Romance"],
    rating: 8.4,
  },
  {
    id: "3",
    title: "Oppenheimer",
    synopsis:
      "A história do físico americano J. Robert Oppenheimer, seu papel no Projeto Manhattan e no desenvolvimento da bomba atômica durante a Segunda Guerra Mundial, e as consequências de longo alcance de suas ações.",
    posterUrl: "/oppenheimer.jpg",
    backdropUrl: "/oppenheimer.jpg",
    trailerUrl: "https://www.youtube.com/embed/bK6ldnjE3Y0",
    duration: 180,
    releaseDate: "20/07/2023",
    classification: "16 anos",
    genres: ["Drama", "Biografia", "História"],
    rating: 8.9,
  },
  {
    id: "4",
    title: "Divertida Mente 2",
    synopsis:
      "Riley entra na adolescência e a Sede das Emoções está passando por uma reforma repentina. Alegria, Tristeza, Raiva, Medo e Nojinho, que há muito tempo administram uma operação bem-sucedida, não sabem como agir quando novas emoções aparecem.",
    posterUrl: "/divertida-mente-2-poster.jpg",
    backdropUrl: "/divertida-mente-2.jpg",
    trailerUrl: "https://www.youtube.com/embed/4xGrpg1nLEY",
    duration: 110,
    releaseDate: "13/06/2024",
    classification: "Livre",
    genres: ["Animação", "Comédia", "Família"],
    rating: 8.2,
  },
  {
    id: "5",
    title: "Deadpool & Wolverine",
    synopsis:
      "O mercenário tagarela Deadpool precisa convencer o aposentado Wolverine a vestir o uniforme mais uma vez para sua maior aventura até agora.",
    posterUrl: "/deadpool-e-wolverine.jpg",
    backdropUrl: "/deadpool-e-wolverine-backdrop.jpg",
    trailerUrl: "https://www.youtube.com/embed/uTLWMmvkZ9U",
    duration: 135,
    releaseDate: "25/07/2024",
    classification: "16 anos",
    genres: ["Ação", "Aventura", "Comédia"],
    rating: 8.5,
  },
  {
    id: "6",
    title: "Godzilla x Kong: O Novo Império",
    synopsis:
      "O poderoso Kong e o temível Godzilla enfrentam uma colossal ameaça desconhecida escondida em nosso mundo, desafiando sua própria existência e a nossa.",
    posterUrl: "/godzilla-poster.jpg",
    backdropUrl: "/godzilla.jpg",
    trailerUrl: "https://www.youtube.com/embed/B7dr3XW7OuU",
    duration: 115,
    releaseDate: "28/03/2024",
    classification: "12 anos",
    genres: ["Ação", "Ficção Científica", "Aventura"],
    rating: 7.8,
  },
  {
    id: "7",
    title: "Furiosa: Uma Saga Mad Max",
    synopsis: "A origem da imperatriz Furiosa antes de se unir a Max Rockatansky em 'Mad Max: Estrada da Fúria'.",
    posterUrl: "/furiosa.jpeg",
    backdropUrl: "/furiosa.jpeg",
    trailerUrl: "https://www.youtube.com/embed/XHIKbX3ULfQ",
    duration: 150,
    releaseDate: "23/05/2024",
    classification: "16 anos",
    genres: ["Ação", "Aventura", "Ficção Científica"],
    rating: 8.1,
    isComingSoon: true,
  },
  {
    id: "8",
    title: "Alien: Romulus",
    synopsis:
      "Um grupo de jovens colonizadores espaciais se encontra cara a cara com a forma de vida mais aterrorizante do universo enquanto explora as ruínas de uma estação espacial abandonada.",
    posterUrl: "/alien-romulus-poster.jpeg",
    backdropUrl: "/alien-romulus.jpg",
    trailerUrl: "https://www.youtube.com/embed/m3aXK0YHhD8",
    duration: 120,
    releaseDate: "15/08/2024",
    classification: "16 anos",
    genres: ["Terror", "Ficção Científica", "Suspense"],
    rating: 7.9,
    isComingSoon: true,
  },
  {
    id: "9",
    title: "Coringa: Delírio a Dois",
    synopsis:
      "Arthur Fleck está internado em Arkham quando se apaixona por uma paciente chamada Harley Quinn. O caos se desenrola nas ruas de Gotham enquanto a história de Coringa é contada através da música.",
    posterUrl: "/coringa-poster.jpg",
    backdropUrl: "/coringa.jpg",
    trailerUrl: "https://www.youtube.com/embed/5gzQYtJSMTw",
    duration: 140,
    releaseDate: "03/10/2024",
    classification: "18 anos",
    genres: ["Crime", "Drama", "Musical"],
    rating: 7.5,
    isComingSoon: true,
  },
  {
    id: "10",
    title: "Gladiador 2",
    synopsis:
      "A continuação do épico de 2000 segue Lucius, filho de Lucilla e sobrinho de Commodus, agora um homem adulto.",
    posterUrl: "/gladiador.jpg",
    backdropUrl: "/gladiador-backdrop.jpg",
    trailerUrl: "https://www.youtube.com/embed/nNbIKjQqaLw",
    duration: 160,
    releaseDate: "14/11/2024",
    classification: "16 anos",
    genres: ["Ação", "Drama", "História"],
    rating: 7.7,
    isComingSoon: true,
  },
  {
    id: "11",
    title: "Venom 3",
    synopsis:
      "Eddie Brock e Venom estão fugindo tanto das autoridades quanto de novos simbiotes ameaçadores que surgiram.",
    posterUrl: "/venom-3-poster.jpg",
    backdropUrl: "/venom-3.jpg",
    trailerUrl: "https://www.youtube.com/embed/znFjPzABtqM",
    duration: 120,
    releaseDate: "24/10/2024",
    classification: "14 anos",
    genres: ["Ação", "Ficção Científica", "Aventura"],
    rating: 7.3,
    isComingSoon: true,
  },
  {
    id: "12",
    title: "Planeta dos Macacos: O Reinado",
    synopsis:
      "Muitas sociedades de macacos cresceram desde que César trouxe seu povo à liberdade, enquanto muitos grupos humanos lutam para sobreviver.",
    posterUrl: "/planeta-dos-macacos.jpg",
    backdropUrl: "/planeta-dos-macacos.jpg",
    trailerUrl: "https://www.youtube.com/embed/Ts_JpkG_s0Y",
    duration: 145,
    releaseDate: "09/05/2024",
    classification: "14 anos",
    genres: ["Ação", "Aventura", "Ficção Científica"],
    rating: 7.6,
    isComingSoon: true,
  },
]

export const mockCinemas: Cinema[] = [
  {
    id: "1",
    name: "CineXplorer Millenium",
    address: "Av. Djalma Batista, 1661 - Chapada, Manaus - AM, 69050-010",
    imageUrl: "/millenium.webp",
    roomTypes: ["2D", "3D", "IMAX"],
    rating: 4.8,
    reviewCount: 1245,
    location: {
      lat: -23.6229,
      lng: -46.6973,
    },
  },
  {
    id: "2",
    name: "CineXplorer Amazonas Shopping",
    address: "Av. Djalma Batista, 482 - Parque 10 de Novembro, Manaus - AM, 69050-010",
    imageUrl: "/amazonas-shopping.jpg",
    roomTypes: ["2D", "3D", "VIP"],
    rating: 4.6,
    reviewCount: 987,
    location: {
      lat: -23.5632,
      lng: -46.6544,
    },
  },
  {
    id: "3",
    name: "CineXplorer Plaza",
    address: "Av. Djalma Batista, 2100 - Chapada, Manaus - AM, 69050-010",
    imageUrl: "/plaza.jpg",
    roomTypes: ["2D", "3D", "IMAX", "4DX"],
    rating: 4.7,
    reviewCount: 1102,
    location: {
      lat: -22.9999,
      lng: -43.3652,
    },
  },
  {
    id: "4",
    name: "CineXplorer Via Norte",
    address: "Avenida Arquiteto José Henrique Bento Rodrigues, 3541 - Santa Etelvina, Manaus - AM, 69093-149",
    imageUrl: "/via-norte.webp",
    roomTypes: ["2D", "3D", "VIP"],
    rating: 4.5,
    reviewCount: 876,
    location: {
      lat: -19.9352,
      lng: -43.9382,
    },
  },
  {
    id: "5",
    name: "CineXplorer Grande Circular",
    address: "Av. Autaz Mirim, 6100 - São José Operário, Manaus - AM, 69085-000",
    imageUrl: "/grande-circular.jpg",
    roomTypes: ["2D", "3D", "IMAX", "VIP"],
    rating: 4.9,
    reviewCount: 1532,
    location: {
      lat: -23.5868,
      lng: -46.6847,
    },
  },
  {
    id: "6",
    name: "CineXplorer Sumaúma",
    address: "Av. Noel Nutels, 1762 - Cidade Nova, Manaus - AM, 69095-000",
    imageUrl: "/sumauma.jpg",
    roomTypes: ["2D", "3D", "4DX"],
    rating: 4.4,
    reviewCount: 743,
    location: {
      lat: -15.7801,
      lng: -47.8825,
    },
  },
]

export const mockSessions: Session[] = [
  {
    id: "1",
    movieId: "1",
    cinemaId: "1",
    roomId: "1",
    roomName: "Sala 1",
    roomType: "IMAX",
    date: "2024-05-17",
    time: "14:30",
    price: 45.0,
    availableSeats: 120,
    totalSeats: 150,
  },
  {
    id: "2",
    movieId: "1",
    cinemaId: "1",
    roomId: "2",
    roomName: "Sala 2",
    roomType: "3D",
    date: "2024-05-17",
    time: "17:00",
    price: 35.0,
    availableSeats: 80,
    totalSeats: 100,
  },
  {
    id: "3",
    movieId: "1",
    cinemaId: "1",
    roomId: "3",
    roomName: "Sala 3",
    roomType: "2D",
    date: "2024-05-17",
    time: "19:30",
    price: 30.0,
    availableSeats: 90,
    totalSeats: 100,
  },
  {
    id: "4",
    movieId: "2",
    cinemaId: "1",
    roomId: "1",
    roomName: "Sala 1",
    roomType: "IMAX",
    date: "2024-05-17",
    time: "20:00",
    price: 45.0,
    availableSeats: 130,
    totalSeats: 150,
  },
  {
    id: "5",
    movieId: "3",
    cinemaId: "2",
    roomId: "1",
    roomName: "Sala VIP",
    roomType: "VIP",
    date: "2024-05-17",
    time: "18:45",
    price: 60.0,
    availableSeats: 40,
    totalSeats: 50,
  },
]

export const mockRooms: Room[] = [
  {
    id: "1",
    name: "Sala 1 - IMAX",
    cinemaId: "1",
    type: "IMAX",
    rows: 15,
    seatsPerRow: 10,
    totalSeats: 150,
  },
  {
    id: "2",
    name: "Sala 2 - 3D",
    cinemaId: "1",
    type: "3D",
    rows: 10,
    seatsPerRow: 10,
    totalSeats: 100,
  },
  {
    id: "3",
    name: "Sala 3 - 2D",
    cinemaId: "1",
    type: "2D",
    rows: 10,
    seatsPerRow: 10,
    totalSeats: 100,
  },
  {
    id: "4",
    name: "Sala VIP",
    cinemaId: "2",
    type: "VIP",
    rows: 5,
    seatsPerRow: 10,
    totalSeats: 50,
  },
]

export const generateMockSeats = (sessionId: string, rows: number, seatsPerRow: number): Seat[] => {
  const seats: Seat[] = []
  const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  for (let i = 0; i < rows; i++) {
    const rowLetter = rowLetters[i]
    for (let j = 1; j <= seatsPerRow; j++) {
      // Randomly mark some seats as occupied (about 20%)
      const status = Math.random() < 0.2 ? "occupied" : "available"
      // Mark some seats as premium (middle rows)
      const type = i >= Math.floor(rows / 4) && i < Math.floor((rows * 3) / 4) ? "premium" : "standard"

      seats.push({
        id: `${sessionId}-${rowLetter}${j}`,
        row: rowLetter,
        number: j,
        status,
        type,
      })
    }
  }

  return seats
}

export const mockTickets: Ticket[] = [
  {
    id: "1",
    sessionId: "1",
    movieTitle: "Duna: Parte 2",
    cinemaName: "CineXplorer Morumbi",
    roomName: "Sala 1 - IMAX",
    date: "17/05/2024",
    time: "14:30",
    seats: [
      { row: "F", number: 5 },
      { row: "F", number: 6 },
    ],
    ticketType: "inteira",
    price: 90.0,
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    purchaseDate: "15/05/2024",
    userId: "2",
  },
  {
    id: "2",
    sessionId: "5",
    movieTitle: "Oppenheimer",
    cinemaName: "CineXplorer Paulista",
    roomName: "Sala VIP",
    date: "17/05/2024",
    time: "18:45",
    seats: [{ row: "C", number: 7 }],
    ticketType: "meia",
    price: 30.0,
    qrCode:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    purchaseDate: "16/05/2024",
    userId: "2",
  },
]
