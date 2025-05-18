import Link from "next/link"
import { Film, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 md:grid-cols-2">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">CineXplorer</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Sua experiência cinematográfica completa. Encontre os melhores filmes, reserve seus ingressos e desfrute
              do melhor do cinema com o CineXplorer.
            </p>
            <div className="flex mt-6 space-x-4">
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Cinemas</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/cinemas" className="text-sm text-gray-400 hover:text-primary">
                  Todos os Cinemas
                </Link>
              </li>
              <li>
                <Link href="/cinemas/sao-paulo" className="text-sm text-gray-400 hover:text-primary">
                  São Paulo
                </Link>
              </li>
              <li>
                <Link href="/cinemas/rio-de-janeiro" className="text-sm text-gray-400 hover:text-primary">
                  Rio de Janeiro
                </Link>
              </li>
              <li>
                <Link href="/cinemas/belo-horizonte" className="text-sm text-gray-400 hover:text-primary">
                  Belo Horizonte
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Filmes</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/em-cartaz" className="text-sm text-gray-400 hover:text-primary">
                  Em Cartaz
                </Link>
              </li>
              <li>
                <Link href="/em-breve" className="text-sm text-gray-400 hover:text-primary">
                  Em Breve
                </Link>
              </li>
              <li>
                <Link href="/filmes/mais-populares" className="text-sm text-gray-400 hover:text-primary">
                  Mais Populares
                </Link>
              </li>
              <li>
                <Link href="/filmes/lancamentos" className="text-sm text-gray-400 hover:text-primary">
                  Lançamentos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-white uppercase">Suporte</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-primary">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-gray-400 hover:text-primary">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/termos-de-uso" className="text-sm text-gray-400 hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-sm text-gray-400 hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 border-t border-gray-800">
          <p className="text-sm text-center text-gray-400">
            &copy; {new Date().getFullYear()} CineXplorer. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
