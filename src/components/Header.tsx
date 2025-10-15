import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold tracking-tight">
              SMART<span className="text-primary">x</span>
            </h1>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm font-medium hover:text-primary transition-colors">
                HOME
              </a>
              <a href="#artistas" className="text-sm font-medium hover:text-primary transition-colors">
                ARTISTAS
              </a>
              <a href="#candinho" className="text-sm font-medium hover:text-primary transition-colors">
                CANDINHO
              </a>
              <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors">
                CONTATO
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Login
            </Button>
            <Button size="sm" className="hidden md:inline-flex">
              Cadastre-se
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
