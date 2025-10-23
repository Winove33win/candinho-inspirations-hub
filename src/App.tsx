import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Candinho from "./pages/Candinho";
import ArtistsIndex from "./pages/public/ArtistsIndex";
import ArtistDetail from "./pages/public/ArtistDetail";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import MeuPerfil from "./pages/dashboard/MeuPerfil";
import Projects from "./pages/dashboard/Projects";
import Events from "./pages/dashboard/Events";
import Documents from "./pages/dashboard/Documents";
import MinhaInscricao from "./pages/dashboard/MinhaInscricao";
import Suporte from "./pages/dashboard/Suporte";
import CadastroPersonalizado from "./pages/dashboard/CadastroPersonalizado";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/candinho" element={<Candinho />} />
          <Route path="/artistas" element={<ArtistsIndex />} />
          <Route path="/artista/:slug" element={<ArtistDetail />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<MeuPerfil />} />
            <Route path="projetos" element={<Projects />} />
            <Route path="eventos" element={<Events />} />
            <Route path="documentos" element={<Documents />} />
            <Route path="inscricao" element={<MinhaInscricao />} />
            <Route path="suporte" element={<Suporte />} />
            <Route path="personalizado" element={<CadastroPersonalizado />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
