const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground py-12 border-t border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              SMART<span className="text-primary">x</span>
            </h3>
            <p className="text-sm text-secondary-foreground/70">
              Conectando talentos extraordinários ao mundo da música.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#artistas" className="hover:text-primary transition-colors">Artistas</a></li>
              <li><a href="#candinho" className="hover:text-primary transition-colors">Candinho</a></li>
              <li><a href="#contato" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li>contato@smartx.com</li>
              <li>+55 (11) 1234-5678</li>
              <li>São Paulo, Brasil</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 text-center text-sm text-secondary-foreground/70">
          <p>&copy; 2025 SMARTx. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
