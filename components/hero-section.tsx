"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { mockMovies } from "@/lib/mock-data"

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const featuredMovies = mockMovies.slice(0, 3)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [featuredMovies.length])

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={featuredMovies[currentIndex].backdropUrl || "/placeholder.svg?height=1080&width=1920"}
          alt={featuredMovies[currentIndex].title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
      </div>

      {/* Content */}
      <div className="container relative h-full flex flex-col justify-end pb-12 md:pb-20 px-4">
        <div className="max-w-3xl">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30">Em Destaque</Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {featuredMovies[currentIndex].title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              <span>{featuredMovies[currentIndex].duration} min</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Estreia: {featuredMovies[currentIndex].releaseDate}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {featuredMovies[currentIndex].classification}
            </Badge>
            {featuredMovies[currentIndex].genres.map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground max-w-2xl mb-6 line-clamp-3 md:line-clamp-none">
            {featuredMovies[currentIndex].synopsis}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href={`/filmes/${featuredMovies[currentIndex].id}/ingressos`}>Comprar Ingressos</Link>
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <Play className="h-4 w-4" />
              Ver Trailer
            </Button>
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-primary w-8" : "bg-gray-500"
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
