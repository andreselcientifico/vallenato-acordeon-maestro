import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Music, User, LogOut, Menu, X, Crown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import AuthDialog from "./AuthDialog";
import { logo } from "@/util/imageImports";
import { useAuth } from "@/context/AuthContext";
import { sendEmail } from "@/api/email";
import { getUserSubscriptions } from "@/api/subscriptions";
import { ThemeToggle } from "./ThemeToggle";
import { ResponsiveImage } from "./ui/ResponsiveImage";

const Header = memo(() => {
  const navigate = useNavigate();
  const { user, login, logout, loading } = useAuth();
  const isAdmin = Boolean(
    user && (user.role === "admin" || (user as any).isAdmin),
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resendState, setResendState] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    hasValidSubscription: boolean;
    isActive: boolean;
    endDate?: Date;
  }>({ hasValidSubscription: false, isActive: false });

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (!user) {
        setSubscriptionStatus({ hasValidSubscription: false, isActive: false });
        return;
      }

      try {
        const subscriptions = await getUserSubscriptions();
        const now = new Date();

        // Find the most recent subscription (active or cancelled but not expired)
        const validSubscription = subscriptions.find((sub) => {
          const endDate = new Date(sub.end_time);
          return sub.status === true || (sub.status === false && endDate > now);
        });

        if (validSubscription) {
          const endDate = new Date(validSubscription.end_time);
          setSubscriptionStatus({
            hasValidSubscription: true,
            isActive: validSubscription.status === true,
            endDate: endDate,
          });
        } else {
          setSubscriptionStatus({
            hasValidSubscription: false,
            isActive: false,
          });
        }
      } catch (error) {
        setSubscriptionStatus({ hasValidSubscription: false, isActive: false });
      }
    };

    loadSubscriptionStatus();
  }, [user]);

  const avatarSrc = (user as any)?.profile_image_url || (user as any)?.avatar;
  const isUrl = avatarSrc?.startsWith("http");
  const avatarLetter = user?.name?.charAt(0).toUpperCase() || "U";

  const HeaderSkeleton = () => (
    <div className="flex items-center space-x-4">
      <div className="h-10 w-32 bg-muted/40 rounded animate-pulse" />
      <div className="h-10 w-24 bg-muted/40 rounded animate-pulse" />
    </div>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-border shadow-sm">
      {/* Banner de verificación compacto (fijo debajo del header para no romper layout) */}
      {!loading && user && user.verified === false && bannerVisible && (
        <div className="fixed left-0 right-0 top-20 z-40 flex justify-center pointer-events-none">
          <div className="pointer-events-auto max-w-7xl w-full mx-4 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md shadow-sm">
            <div className="flex items-center justify-between px-3 py-2 text-sm">
              <div className="flex items-center space-x-3">
                <span>Tu correo ({user.email}) no está verificado.</span>
                <button
                  onClick={async () => {
                    if (!user?.email) return;
                    setResendState("sending");
                    setResendMessage(null);
                    try {
                      const res = await sendEmail(user.email);
                      if (!res.ok) throw new Error(await res.text());
                      setResendState("sent");
                      setResendMessage(
                        "Correo de verificación enviado. Revisa tu bandeja.",
                      );
                    } catch (err) {
                      setResendState("error");
                      setResendMessage(
                        "Error al enviar el correo. Intenta de nuevo más tarde.",
                      );
                    }
                  }}
                  className="inline-flex items-center px-2 py-1 rounded bg-yellow-600 text-white text-xs hover:bg-yellow-700 transition"
                  disabled={resendState === "sending"}
                >
                  {resendState === "sending"
                    ? "Enviando..."
                    : resendState === "sent"
                      ? "Enviado"
                      : "Reenviar"}
                </button>
                {resendMessage && (
                  <span className="text-xs text-yellow-800 ml-2">
                    {resendMessage}
                  </span>
                )}
              </div>
              <button
                aria-label="Cerrar aviso de verificación"
                onClick={() => setBannerVisible(false)}
                className="text-yellow-800 hover:text-yellow-900 text-sm px-2"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div
          className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <ResponsiveImage
            src={logo.original}
            srcSmall={logo.small}
            srcMedium={logo.medium}
            srcLarge={logo.large}
            alt="Vallenato Academy"
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shadow-warm animate-glow"
            widths={{ small: 48, medium: 96, large: 192 }}
            sizes="(max-width: 640px) 40px, 48px"
            width="48"
            height="48"
          />
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-primary truncate">
              Academia Vallenato
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
              Maestro del Acordeón
            </p>
          </div>
        </div>

        <nav className="hidden xl:flex items-center space-x-4 xl:space-x-8">
          <a
            href="/#inicio"
            className="text-foreground hover:text-primary transition-smooth text-sm xl:text-base"
          >
            Inicio
          </a>
          <a
            href="/#biografia"
            className="text-foreground hover:text-primary transition-smooth text-sm xl:text-base"
          >
            Biografía
          </a>
          <a
            href="/cursos"
            className="text-foreground hover:text-primary transition-smooth text-sm xl:text-base"
          >
            Cursos
          </a>
          <a
            href="/suscripciones"
            className="text-foreground hover:text-primary transition-smooth text-sm xl:text-base"
          >
            Suscripciones
          </a>
          <a
            href="/contacto"
            className="text-foreground hover:text-primary transition-smooth text-sm xl:text-base"
          >
            Contacto
          </a>
        </nav>

        {/* Botón menú móvil */}
        <div className="flex items-center space-x-2 xl:hidden">
          <ThemeToggle />
          <button
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setMobileOpen((s) => !s)}
            className="p-2 rounded-md hover:bg-muted/20 transition"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        <div className="hidden xl:flex items-center space-x-3 ml-4 xl:ml-8">
          {loading ? (
            <HeaderSkeleton />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center space-x-2 p-2"
                >
                  <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                    {isUrl ? (
                      <img
                        src={avatarSrc}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      avatarSrc || avatarLetter
                    )}
                  </div>
                  {subscriptionStatus.hasValidSubscription && (
                    <div className="flex items-center space-x-1 ml-1">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <Badge
                        variant={
                          subscriptionStatus.isActive ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {subscriptionStatus.isActive ? "Activa" : "Cancelada"}
                      </Badge>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="h-4 w-4 mr-2" />
                  Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/mis-cursos")}>
                  <Music className="h-4 w-4 mr-2" />
                  Mis Cursos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/mis-logros")}>
                  <Music className="h-4 w-4 mr-2" />
                  Mis Logros
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <User className="h-4 w-4 mr-2" />
                    Admin Panel
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog
              onLogin={(u) => {
                login(u);
              }}
            >
              <Button
                variant="hero"
                size="lg"
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Iniciar Sesión</span>
              </Button>
            </AuthDialog>
          )}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Panel menú móvil */}
      {mobileOpen && (
        <div className="fixed top-20 left-0 w-full h-[calc(100%-5rem)] bg-background z-50 xl:hidden shadow-xl">
          <div className="px-6 py-6 space-y-6">
            <nav className="flex flex-col space-y-4">
              <a
                href="/#inicio"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary"
              >
                Inicio
              </a>
              <a
                href="/#biografia"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary"
              >
                Biografía
              </a>
              <button
                onClick={() => {
                  navigate("/cursos");
                  setMobileOpen(false);
                }}
                className="text-left text-lg font-medium text-foreground hover:text-primary"
              >
                Cursos
              </button>
              <button
                onClick={() => {
                  navigate("/suscripciones");
                  setMobileOpen(false);
                }}
                className="text-left text-lg font-medium text-foreground hover:text-primary"
              >
                Suscripciones
              </button>
              <a
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="text-lg font-medium text-foreground hover:text-primary"
              >
                Contacto
              </a>
            </nav>

            <div className="pt-4 border-t border-border">
              {loading ? (
                <div className="space-y-3">
                  <div className="h-5 w-40 bg-muted/40 rounded animate-pulse" />
                  <div className="h-5 w-32 bg-muted/40 rounded animate-pulse" />
                </div>
              ) : user ? (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => {
                      navigate("/perfil");
                      setMobileOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <User className="h-5 w-5" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/mis-cursos");
                      setMobileOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Music className="h-5 w-5" />
                    <span>Mis Cursos</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/mis-logros");
                      setMobileOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <Music className="h-5 w-5" />
                    <span>Mis Logros</span>
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        navigate("/admin");
                        setMobileOpen(false);
                      }}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-5 w-5" />
                      <span>Admin Panel</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center space-x-2"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              ) : (
                <AuthDialog
                  onLogin={(u) => {
                    login(u);
                    setMobileOpen(false);
                  }}
                >
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
});

Header.displayName = "Header";

export default Header;
