import { motion } from "framer-motion"
import { Shield, Wifi, TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-black/80 backdrop-blur-md border-t border-primary/10 py-6 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-warning rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">FV</span>
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-warning bg-clip-text text-transparent">
                  FanVerse
                </h3>
                <p className="text-xs text-gray-400">L'expérience ultime des fans de football</p>
              </div>
            </div>
            <p className="text-sm text-gray-400">
              Plongez dans une expérience immersive qui révolutionne la façon dont les fans interagissent avec leur sport préféré.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Liens Rapides</h4>
            <ul className="space-y-2">
              <li>
                <a href="/home" className="text-gray-400 hover:text-primary transition-colors text-sm">Accueil</a>
              </li>
              <li>
                <a href="/stadium" className="text-gray-400 hover:text-primary transition-colors text-sm">Stade Virtuel</a>
              </li>
              <li>
                <a href="/social" className="text-gray-400 hover:text-primary transition-colors text-sm">Communauté</a>
              </li>
              <li>
                <a href="/betting" className="text-gray-400 hover:text-primary transition-colors text-sm">Paris</a>
              </li>
              <li>
                <a href="/nft" className="text-gray-400 hover:text-primary transition-colors text-sm">NFT</a>
              </li>
            </ul>
          </div>

          {/* Stats & Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Informations</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="w-4 h-4 text-success" />
                <span className="text-gray-400">Sécurisé par Blockchain</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className="w-4 h-4 text-primary" />
                <span className="text-gray-400">Powered by Chiliz</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-gray-400">Socios.com Partner</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} FanVerse. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <span className="sr-only">Discord</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-primary transition-colors">
              <span className="sr-only">Telegram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}