import { Music } from "lucide-react";
import { Button } from "./ui/button";
import valenatoLogo from "@/assets/vallenato-logo.jpg";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img 
            src={valenatoLogo} 
            alt="Vallenato Academy" 
            className="h-12 w-12 rounded-full object-cover shadow-warm animate-glow"
          />
          <div>
            <h1 className="text-xl font-bold text-primary">Academia Vallenato</h1>
            <p className="text-sm text-muted-foreground">Maestro del Acordeón</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#inicio" className="text-foreground hover:text-primary transition-smooth">
            Inicio
          </a>
          <a href="#biografia" className="text-foreground hover:text-primary transition-smooth">
            Biografía
          </a>
          <a href="#cursos" className="text-foreground hover:text-primary transition-smooth">
            Cursos
          </a>
          <a href="#videos" className="text-foreground hover:text-primary transition-smooth">
            Videos
          </a>
          <a href="#contacto" className="text-foreground hover:text-primary transition-smooth">
            Contacto
          </a>
        </nav>

        <Button variant="hero" size="lg" className="hidden md:flex items-center space-x-2">
          <Music className="h-4 w-4" />
          <span>Inscríbete Ahora</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;