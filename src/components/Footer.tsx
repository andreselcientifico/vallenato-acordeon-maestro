import { Music, Mail, Phone, MapPin, Instagram, Youtube, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import valenatoLogo from "@/assets/vallenato-logo.png";

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
                alt="Vallenato Academy" 
                className="h-12 w-12 rounded-full object-cover shadow-warm"
              />
              <div>
                <h3 className="text-xl font-bold">Academia Vallenato</h3>
                <p className="text-sm opacity-80">Maestro del Acordeón</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Preservando y compartiendo la tradición del vallenato con estudiantes de todo el mundo. 
              Más de 20 años formando nuevos acordeonistas.
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
              <a href="#inicio" className="block text-white/80 hover:text-white transition-smooth">
                Inicio
              </a>
              <a href="#biografia" className="block text-white/80 hover:text-white transition-smooth">
                Biografía
              </a>
              <a href="#cursos" className="block text-white/80 hover:text-white transition-smooth">
                Cursos
              </a>
              <a href="#videos" className="block text-white/80 hover:text-white transition-smooth">
                Videos
              </a>
              <a href="#contacto" className="block text-white/80 hover:text-white transition-smooth">
                Contacto
              </a>
            </nav>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">Cursos</h4>
            <div className="space-y-4">
              <a href="#" className="block text-white/80 hover:text-white transition-smooth">
                Fundamentos del Acordeón
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-smooth">
                Vallenato Clásico
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-smooth">
                Maestría en Acordeón
              </a>
              <a href="#" className="block text-white/80 hover:text-white transition-smooth">
                Consulta Gratuita
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">Contacto</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-white/80">maestro@academiavallenato.com</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-white/80">+57 123 456 7890</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-white/80">Valledupar, César</div>
                  <div className="text-white/80">Colombia</div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button variant="hero" className="w-full shadow-elegant">
                <Music className="h-4 w-4 mr-2" />
                Comenzar Mi Aprendizaje
              </Button>
            </div>
          </div>
        </div>

        <hr className="border-white/20 my-12" />

        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-white/80">
              © 2024 Academia Vallenato. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-white/80 hover:text-white transition-smooth">
              Política de Privacidad
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-smooth">
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;