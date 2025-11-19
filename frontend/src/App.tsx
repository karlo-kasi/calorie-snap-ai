import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Home } from "./pages/Home";
import { AddFood } from "./pages/AddFood";
import { Diary } from "./pages/Diary";
import { Stats } from "./pages/Stats";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { MainLayout } from "./Layout/MainLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { OnboardingGuard } from "./components/OnboardingGuard";
import { AuthProvider } from "./contexts/AuthContext";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              {/* Rotta pubblica di login */}
              <Route path="/login" element={<Login />} />

              {/* Rotte protette */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <MainLayout>
                        <Home />
                      </MainLayout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <MainLayout>
                        <AddFood />
                      </MainLayout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/diary"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <MainLayout>
                        <Diary />
                      </MainLayout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stats"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <MainLayout>
                        <Stats />
                      </MainLayout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <OnboardingGuard>
                      <MainLayout>
                        <Profile />
                      </MainLayout>
                    </OnboardingGuard>
                  </ProtectedRoute>
                }
              />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
