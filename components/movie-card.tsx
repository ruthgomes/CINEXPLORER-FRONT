import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Movie } from "@/lib/types"

interface MovieCardProps {
  movie: Movie
  className?: string
}

export default function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Link href={`/filmes/${movie.id}`}>
      <Card className={cn("movie-card border-0 bg-transparent overflow-hidden", className)}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-md">
          <Image
            src={movie.posterUrl || "/placeholder.svg?height=450&width=300"}
            alt={movie.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
          {movie.rating && (
            <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 text-yellow-400 text-xs font-medium px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-yellow-400" />
              <span>{movie.rating}</span>
            </div>
          )}
          {movie.isComingSoon && <Badge className="absolute top-2 left-2 bg-primary text-xs">Em Breve</Badge>}
        </div>
        <CardContent className="px-1 pt-3 pb-0">
          <h3 className="font-semibold line-clamp-1 text-sm">{movie.title}</h3>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{movie.genres.join(", ")}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
