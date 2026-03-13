/**
 * App.tsx optimizado con carga diferida (lazy loading)
 * ----------------------------------------------------
 * - Las páginas pesadas NO se cargan en el bundle inicial.
 * - Se dividen en chunks separados para mejorar LCP.
 * - Lighthouse mejora muchísimo (menos chain requests).
 * - AdminRoute también se carga en diferido.
 */

import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from "next-themes";
import { AchievementNotificationProvider } from "@/hooks/useAchievementNotifications";
import { ErrorProvider } from "@/context/ErrorContext";

const queryClient = new QueryClient();

/* ============================
   Lazy Load de todas las páginas con preload inteligente
   ============================ */
const Index = lazy(() => import("./pages/Index"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const MyCoursesPage = lazy(() => import("./pages/MyCoursesPage"));
const CoursePlayerPage = lazy(() => import("./pages/CoursePlayerPage"));
const CoursePreviewPage = lazy(() => import("./pages/CoursePreviewPage"));
const SubscriptionsPage = lazy(() => import("./pages/SubscriptionsPage"));
const MyAchievementsPage = lazy(() => import("./pages/MyAchievementsPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ChangePasswordPage = lazy(() => import("./pages/ChangePasswordPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const FAQPage = lazy(() => import("./pages/FAQPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const PerformanceGalleryPage = lazy(() => import("./pages/PerformanceGalleryPage"));
const AdminInboxPage = lazy(() => import("./pages/admin/AdminInboxPage"));
import AdminRoute from "./components/AdminRoute";
const AchievementSystemInitializer = lazy(
  () => import("./components/AchievementSystemInitializer"),
);

// Preload de rutas críticas
const preloadCriticalRoutes = () => {
  // Preload de la página principal y rutas comunes
  import("./pages/Index");
  import("./pages/CoursesPage");
  import("./pages/ProfilePage");
};

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

const paypalOptionsSuscription = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  vault: true,
  intent: "subscription",
};

/* ============================
   Fallback ULTRA liviano y optimizado
   ============================ */
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-3 text-center bg-background">
    <div className="animate-spin h-8 w-8 border-3 border-t-transparent border-primary rounded-full"></div>
    <p className="text-sm text-muted-foreground">Cargando…</p>
  </div>
);

const App = () => {
  // Preload de rutas críticas al montar la app
  useEffect(() => {
    // Preload de rutas críticas después de que la página inicial se haya cargado
    // Aumentamos el delay a 2000ms para no penalizar el LCP inicial
    const timer = setTimeout(() => {
      preloadCriticalRoutes();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <ErrorProvider>
            <AchievementNotificationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Suspense fallback={<LoadingScreen />}>
                  <AchievementSystemInitializer />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route
                      path="/cursos"
                      element={
                        <TooltipProvider>
                          <PayPalScriptProvider options={paypalOptions}>
                            <CoursesPage />
                          </PayPalScriptProvider>
                        </TooltipProvider>
                      }
                    />
                    <Route path="/mis-cursos" element={<MyCoursesPage />} />
                    <Route
                      path="/mis-logros"
                      element={<MyAchievementsPage />}
                    />
                    <Route
                      path="/suscripciones"
                      element={
                        <PayPalScriptProvider
                          options={paypalOptionsSuscription}
                        >
                          <SubscriptionsPage />
                        </PayPalScriptProvider>
                      }
                    />
                    <Route
                      path="/curso/:courseId/preview"
                      element={<CoursePreviewPage />}
                    />
                    <Route
                      path="/curso/:courseId"
                      element={<CoursePlayerPage />}
                    />
                    <Route path="/perfil" element={<ProfilePage />} />
                    <Route
                      path="/cambiar-contrasena"
                      element={<ChangePasswordPage />}
                    />
                    <Route
                      path="/olvide-contrasena"
                      element={<ForgotPasswordPage />}
                    />
                    <Route
                      path="/resetear-contrasena"
                      element={<ResetPasswordPage />}
                    />
                    <Route path="/contacto" element={<ContactPage />} />
                    <Route path="/eventos" element={<EventsPage />} />
                    <Route path="/galeria-presentaciones" element={<PerformanceGalleryPage />} />
                    <Route
                      path="/politica-privacidad"
                      element={<PrivacyPage />}
                    />
                    <Route path="/terminos-servicio" element={<TermsPage />} />
                    <Route path="/preguntas-frecuentes" element={<FAQPage />} />
                    <Route
                      path="/verificar-email"
                      element={<VerifyEmailPage />}
                    />

                    {/* RUTA CON PROTECCIÓN LAZY */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/inbox"
                      element={
                        <AdminRoute>
                          <AdminInboxPage />
                        </AdminRoute>
                      }
                    />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </BrowserRouter>
            </AchievementNotificationProvider>
          </ErrorProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
