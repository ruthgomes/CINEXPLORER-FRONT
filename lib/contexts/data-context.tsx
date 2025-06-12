"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { mockMovies, mockCinemas, mockSessions } from "@/lib/mock-data"
import type { Movie, Cinema, Session } from "@/lib/types"

interface DataContextType {
  // Movies
  movies: Movie[]
  addMovie: (movie: Omit<Movie, "id">) => void
  updateMovie: (id: string, movie: Partial<Movie>) => void
  deleteMovie: (id: string) => void

  // Cinemas
  cinemas: Cinema[]
  addCinema: (cinema: Omit<Cinema, "id">) => void
  updateCinema: (id: string, cinema: Partial<Cinema>) => void
  deleteCinema: (id: string) => void

  // Sessions
  sessions: Session[]
  addSession: (session: Omit<Session, "id">) => void
  updateSession: (id: string, session: Partial<Session>) => void
  deleteSession: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  // Initialize with mock data
  useEffect(() => {
    setMovies(mockMovies)
    setCinemas(mockCinemas)
    setSessions(mockSessions)
  }, [])

  // Movie functions
  const addMovie = (movieData: Omit<Movie, "id">) => {
    const newMovie: Movie = {
      ...movieData,
      id: `movie-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setMovies((prev) => [...prev, newMovie])
  }

  const updateMovie = (id: string, movieData: Partial<Movie>) => {
    setMovies((prev) => prev.map((movie) => (movie.id === id ? { ...movie, ...movieData } : movie)))
  }

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((movie) => movie.id !== id))
    // Also remove related sessions
    setSessions((prev) => prev.filter((session) => session.movieId !== id))
  }

  // Cinema functions
  const addCinema = (cinemaData: Omit<Cinema, "id">) => {
    const newCinema: Cinema = {
      ...cinemaData,
      id: `cinema-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setCinemas((prev) => [...prev, newCinema])
  }

  const updateCinema = (id: string, cinemaData: Partial<Cinema>) => {
    setCinemas((prev) => prev.map((cinema) => (cinema.id === id ? { ...cinema, ...cinemaData } : cinema)))
  }

  const deleteCinema = (id: string) => {
    setCinemas((prev) => prev.filter((cinema) => cinema.id !== id))
    // Also remove related sessions
    setSessions((prev) => prev.filter((session) => session.cinemaId !== id))
  }

  // Session functions
  const addSession = (sessionData: Omit<Session, "id">) => {
    const newSession: Session = {
      ...sessionData,
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setSessions((prev) => [...prev, newSession])
  }

  const updateSession = (id: string, sessionData: Partial<Session>) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, ...sessionData } : session)))
  }

  const deleteSession = (id: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== id))
  }

  return (
    <DataContext.Provider
      value={{
        movies,
        addMovie,
        updateMovie,
        deleteMovie,
        cinemas,
        addCinema,
        updateCinema,
        deleteCinema,
        sessions,
        addSession,
        updateSession,
        deleteSession,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
