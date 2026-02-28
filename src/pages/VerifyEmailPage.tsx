import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "@/api/user";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verificando tu cuenta...");
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const hasAttemptedRef = useRef(false);

  useEffect(() => {
    const performVerification = async () => {
      if (hasAttemptedRef.current) return;
      hasAttemptedRef.current = true;

      if (!token) {
        setStatus("error");
        setMessage("Token de verificación no encontrado.");
        return;
      }

      try {
        await verifyEmail(token);
        setStatus("success");
        setMessage("¡Tu cuenta ha sido verificada exitosamente!");
      } catch (error: any) {
        setStatus("error");
        setMessage(
          error.message ||
            "No se pudo verificar el correo. El enlace puede haber expirado o ser inválido.",
        );
      }
    };

    performVerification();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md">
        <Card className="border-primary/20 shadow-xl backdrop-blur-sm bg-card/95 transition-all duration-300">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10 ring-8 ring-primary/5">
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Verificación de Cuenta
            </CardTitle>
            <CardDescription>
              Confirmación de dirección de correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 text-center">
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-muted-foreground animate-pulse font-medium">
                  {message}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="p-2">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-foreground">
                    {message}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ahora puedes acceder a todos nuestros cursos y contenido
                    exclusivo.
                  </p>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="p-2">
                  <XCircle className="h-16 w-16 text-destructive" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-semibold text-foreground">
                    Ocurrió un error
                  </p>
                  <p className="text-sm text-destructive font-medium">
                    {message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-4">
                    Si el problema persiste, por favor contacta a soporte o
                    solicita un nuevo enlace de verificación.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            {status === "success" ? (
              <Button
                onClick={() => navigate("/perfil")}
                className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Ir a mi Perfil <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : status === "error" ? (
              <>
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="w-full h-11 text-base font-medium"
                >
                  Regresar al Inicio
                </Button>
                <Link
                  to="/contacto"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  ¿Necesitas ayuda?
                </Link>
              </>
            ) : null}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
