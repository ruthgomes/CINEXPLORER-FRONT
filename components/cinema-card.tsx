import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import type { Cinema } from "@/lib/types"

interface CinemaCardProps {
  cinema: Cinema
}

export default function CinemaCard({ cinema }: CinemaCardProps) {
  return (
    <Link href={`/cinemas/${cinema.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-card/50 backdrop-blur-sm">
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{cinema.rating}</span>
              <span className="text-xs text-muted-foreground">({cinema.reviewCount} avaliações)</span>
            </div>
            <div className="flex gap-1">
              {cinema.roomTypes.map((type) => (
                <Badge key={type} variant="outline" className="text-xs">
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
