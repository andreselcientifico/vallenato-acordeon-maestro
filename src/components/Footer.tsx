import { Music, Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import valenatoLogo from "@/assets/vallenato-logo.webp";

const Footer = () => {
  return (
    <footer id="contacto" className="bg-gradient-to-b from-vallenato-brown to-vallenato-brown/90 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src={valenatoLogo} 
                alt="Andrea Paola Argote" 
                className="h-12 w-12 rounded-full object-cover shadow-warm"
              />
              <div>
                <h3 className="text-xl font-bold">Andrea Paola Argote Chávez</h3>
                <p className="text-sm opacity-80">Maestra en Música, Ingeniería de Sonido</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Egresada de la Pontificia Universidad Javeriana en Bogotá. Especialista en acordeón vallenato, 
              producción audiovisual y educación musical. Embajadora cultural de Colombia reconocida internacionalmente. 
              Comprometida con preservar y compartir la tradición del vallenato con estudiantes de todo el mundo.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-white/20 text-white hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">Navegación</h4>
            <nav className="space-y-4">
              <a href="/" className="block text-white/80 hover:text-white transition-smooth">
                Inicio
              </a>
              <a href="/cursos" className="block text-white/80 hover:text-white transition-smooth">
                Cursos
              </a>
              <a href="/contacto" className="block text-white/80 hover:text-white transition-smooth">
                Contacto
              </a>
              <a href="/preguntas-frecuentes" className="block text-white/80 hover:text-white transition-smooth">
                Preguntas Frecuentes
              </a>
            </nav>
          </div>

          {/* About Andrea */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">Sobre Andrea</h4>
            <div className="space-y-3 text-sm">
              <p className="text-white/80">
                <strong>Formación:</strong> Maestra en Música - Pontificia Universidad Javeriana
              </p>
              <p className="text-white/80">
                <strong>Especialidad:</strong> Acordeón Vallenato e Ingeniería de Sonido
              </p>
              <p className="text-white/80">
                <strong>Experiencia:</strong> Talleres, grabación, mezcla y producción audiovisual
              </p>
              <p className="text-white/80">
                <strong>Reconocimiento:</strong> Embajadora Cultural de Colombia
              </p>
              <p className="text-white/80">
                <strong>Ubicación:</strong> Agustín Codazzi, Cesar - Colombia
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-sm text-white/80">andrea@academiavallenato.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-sm text-white/80">+57 316 4537031</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-sm text-white/80">Agustín Codazzi</div>
                  <div className="text-sm text-white/80">Cesar, Colombia</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="hero" className="w-full shadow-elegant">
                <Music className="h-4 w-4 mr-2" />
                Explorar Cursos
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-white/20 my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-white/80">
              © 2024 Andrea Paola Argote Chávez. Todos los derechos reservados. | 
              <span className="text-vallenato-gold ml-2">Maestra en Música - Pontificia Universidad Javeriana</span>
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="/politica-privacidad" className="text-white/80 hover:text-white transition-smooth">
              Política de Privacidad
            </a>
            <a href="/terminos-servicio" className="text-white/80 hover:text-white transition-smooth">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;