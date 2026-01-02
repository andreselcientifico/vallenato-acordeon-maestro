/**
 * App.tsx optimizado con carga diferida (lazy loading)
 * ----------------------------------------------------
 * - Las páginas pesadas NO se cargan en el bundle inicial.
 * - Se dividen en chunks separados para mejorar LCP.
 * - Lighthouse mejora muchísimo (menos chain requests).
 * - AdminRoute también se carga en diferido.
 */

import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AchievementNotificationProvider } from "@/hooks/useAchievementNotifications";

const queryClient = new QueryClient();

/* ============================
   Lazy Load de todas las páginas
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
const AdminRoute = lazy(() => import("./components/AdminRoute"));
const AchievementSystemInitializer = lazy(() => import("./components/AchievementSystemInitializer"));

const paypalOptions = {
  clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency: "USD",
  intent: "capture",
};

/* ============================
   Fallback ULTRA liviano
   ============================ */
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
    <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
    <p className="text-lg text-muted-foreground">Cargando…</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AchievementNotificationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Suspense fallback={<LoadingScreen />}>
            <AchievementSystemInitializer />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cursos" element={
                <TooltipProvider>
                  <PayPalScriptProvider options={paypalOptions}>
                    <CoursesPage />
                  </PayPalScriptProvider>
                </TooltipProvider>
              } 
              />
              <Route path="/mis-cursos" element={<MyCoursesPage />} />
              <Route path="/mis-logros" element={<MyAchievementsPage />} />
              <Route path="/suscripciones" element={
                <PayPalScriptProvider options={paypalOptions}>
                  <SubscriptionsPage />
                </PayPalScriptProvider>
              } />
              <Route path="/curso/:courseId/preview" element={<CoursePreviewPage />} />
              <Route path="/curso/:courseId" element={<CoursePlayerPage />} />
              <Route path="/perfil" element={<ProfilePage />} />

              {/* RUTA CON PROTECCIÓN LAZY */}
              <Route
                path="/admin"
                element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AchievementNotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
