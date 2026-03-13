import { Music, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "./ui/button";
import { logo } from "@/util/imageImports";
import { ResponsiveImage } from "./ui/ResponsiveImage";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer
      id="contacto"
      className="bg-gradient-to-b from-vallenato-brown to-vallenato-brown/90 text-white py-16"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo and Description */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <ResponsiveImage
                src={logo.original}
                srcSmall={logo.small}
                srcMedium={logo.medium}
                srcLarge={logo.large}
                alt="Andrea Paola Argote"
                className="h-12 w-12 rounded-full object-cover shadow-warm"
                widths={{ small: 48, medium: 96, large: 192 }}
                sizes="48px"
                width="48"
                height="48"
              />
              <div>
                <h3 className="text-xl font-bold">
                  Andrea Paola Argote Chávez
                </h3>
                <p className="text-sm opacity-80">
                  Maestra en Música, Ingeniería de Sonido
                </p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              Egresada de la Pontificia Universidad Javeriana en Bogotá.
              Especialista en acordeón vallenato, producción audiovisual y
              educación musical. Embajadora cultural de Colombia reconocida
              internacionalmente. Comprometida con preservar y compartir la
              tradición del vallenato con estudiantes de todo el mundo.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/andreaargote?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 text-white hover:text-white"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
              </a>
              <a
                href="https://www.threads.com/@andreaargote?xmt=AQF0ogdWY3Js72mQSopVHrzC4YyUiT6ErBtJz9PneQe8yyA"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 text-white hover:text-white"
                  aria-label="Threads"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="5"
                    height="5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098c1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015c-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164c1.43 1.783 3.631 2.698 6.54 2.717c2.623-.02 4.358-.631 5.8-2.045c1.647-1.613 1.618-3.593 1.09-4.798c-.31-.71-.873-1.3-1.634-1.75c-.192 1.352-.622 2.446-1.284 3.272c-.886 1.102-2.14 1.704-3.73 1.79c-1.202.065-2.361-.218-3.259-.801c-1.063-.689-1.685-1.74-1.752-2.964c-.065-1.19.408-2.285 1.33-3.082c.88-.76 2.119-1.207 3.583-1.291a14 14 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757c-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32l-1.757-1.18c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388q.163.07.321.142c1.49.7 2.58 1.761 3.154 3.07c.797 1.82.871 4.79-1.548 7.158c-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69q-.362 0-.739.021c-1.836.103-2.98.946-2.916 2.143c.067 1.256 1.452 1.839 2.784 1.767c1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221"
                    />
                  </svg>
                </Button>
              </a>
              <a
                href="https://www.facebook.com/andrea.argote.96"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-white/20 text-white hover:text-white"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">
              Navegación
            </h4>
            <nav className="space-y-4">
              <a
                href="/"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Inicio
              </a>
              <a
                href="/cursos"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Cursos
              </a>
              <a
                href="/contacto"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Contacto
              </a>
              <a
                href="/eventos"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Eventos
              </a>
              <a
                href="/galeria-presentaciones"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Galería de Presentaciones
              </a>
              <a
                href="/preguntas-frecuentes"
                className="block text-white/80 hover:text-white transition-smooth"
              >
                Preguntas Frecuentes
              </a>
            </nav>
          </div>

          {/* About Andrea */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">
              Sobre Andrea
            </h4>
            <div className="space-y-3 text-sm">
              <p className="text-white/80">
                <strong>Formación:</strong> Maestra en Música - Pontificia
                Universidad Javeriana
              </p>
              <p className="text-white/80">
                <strong>Especialidad:</strong> Acordeón Vallenato e Ingeniería
                de Sonido
              </p>
              <p className="text-white/80">
                <strong>Experiencia:</strong> Talleres, grabación, mezcla y
                producción audiovisual
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
            <h4 className="text-lg font-semibold mb-6 text-vallenato-gold">
              Contacto
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-vallenato-gold flex-shrink-0" />
                <div>
                  <div className="text-sm text-white/80">
                    andrea@academiavallenato.com
                  </div>
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
              <Button variant="hero" className="w-full shadow-elegant" onClick={() => navigate("/cursos")}>
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
              © 2024 Andrea Paola Argote Chávez. Todos los derechos reservados.
              |
              <span className="text-vallenato-gold ml-2">
                Maestra en Música - Pontificia Universidad Javeriana
              </span>
            </p>
          </div>
          <div className="flex space-x-6 text-sm">
            <a
              href="/politica-privacidad"
              className="text-white/80 hover:text-white transition-smooth"
            >
              Política de Privacidad
            </a>
            <a
              href="/terminos-servicio"
              className="text-white/80 hover:text-white transition-smooth"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
