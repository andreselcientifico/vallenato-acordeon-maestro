import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Music, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import AuthDialog from "./AuthDialog";
import valenatoLogo from "@/assets/vallenato-logo.png";
import { getCurrentUser } from "@/api/auth";
import { API_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { user, login, logout, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-border shadow-lg">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer"  onClick={() => navigate('/')}>
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

        {/* Botón menú móvil */}
        <div className="flex items-center md:hidden">
          <button
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-muted/20 transition"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
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
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <User className="h-4 w-4 mr-2" />
                  Admin Panel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog onLogin={login}>
              <Button variant="hero" size="lg" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </AuthDialog>
          )}
        </div>
      </div>

      {/* Panel menú móvil */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 w-full h-[calc(100%-5rem)] bg-white dark:bg-slate-900 z-50 md:hidden shadow-xl">
          <div className="px-6 py-6 space-y-6">
            <nav className="flex flex-col space-y-4">
              <a href="#inicio" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                Inicio
              </a>
              <a href="#biografia" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                Biografía
              </a>
              <button onClick={() => { navigate('/cursos'); setMobileOpen(false); }} className="text-left text-lg font-medium text-foreground hover:text-primary">
                Cursos
              </button>
              <a href="#videos" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                Videos
              </a>
              <a href="#contacto" onClick={() => setMobileOpen(false)} className="text-lg font-medium text-foreground hover:text-primary">
                Contacto
              </a>
            </nav>

            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="flex flex-col space-y-3">
                  <button onClick={() => { navigate('/perfil'); setMobileOpen(false); }} className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Mi Perfil</span>
                  </button>
                  <button onClick={() => { navigate('/cursos'); setMobileOpen(false); }} className="flex items-center space-x-2">
                    <Music className="h-5 w-5" />
                    <span>Mis Cursos</span>
                  </button>
                 <button onClick={() => { navigate('/admin'); setMobileOpen(false); }} className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </button>
                  <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <AuthDialog onLogin={(u) => { login(u); setMobileOpen(false); }}>
                  <Button variant="hero" className="w-full">
                    Iniciar Sesión
                  </Button>
                </AuthDialog>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;