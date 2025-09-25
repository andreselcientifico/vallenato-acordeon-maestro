import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import AuthDialog from "./AuthDialog";
import valenatoLogo from "@/assets/vallenato-logo.jpg";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleLogin = (userData: { email: string; name: string }) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

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
          <a href="/cursos" className="text-foreground hover:text-primary transition-smooth">
            Cursos
          </a>
          <a href="#videos" className="text-foreground hover:text-primary transition-smooth">
            Videos
          </a>
          <a href="#contacto" className="text-foreground hover:text-primary transition-smooth">
            Contacto
          </a>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="lg" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/perfil')}>
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cursos')}>
                  <Music className="h-4 w-4 mr-2" />
                  Mis Cursos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog onLogin={handleLogin}>
              <Button variant="hero" size="lg" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </AuthDialog>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;