const Footer = () => {
  return (
    <footer
      id="siteFooter"
      className="mt-24 rounded-t-[32px] border-t border-[rgba(255,255,255,0.12)] bg-[rgba(6,0,0,0.88)] pt-16 text-[rgba(250,250,252,0.75)]"
    >
      <div className="site-container grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <h3 className="text-2xl font-extrabold tracking-[0.32em] text-[var(--ink)]">
            SMART<span className="text-[var(--brand)]">x</span>
          </h3>
          <p className="text-sm leading-relaxed text-[rgba(250,250,252,0.6)]">
            Conectamos artistas, curadores e plateias com experiências imersivas em música clássica, world music e jazz.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">Sobre</h4>
          <p className="text-sm text-[rgba(250,250,252,0.6)]">
            Plataforma streaming-like com curadoria humana, tecnologia assistiva e integração direta com o Portal do Artista.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">Contato</h4>
          <ul className="space-y-2 text-sm text-[rgba(250,250,252,0.6)]">
            <li><a href="mailto:contato@smartx.art" className="hover:text-[var(--ink)]">contato@smartx.art</a></li>
            <li><a href="tel:+351210000000" className="hover:text-[var(--ink)]">+351 21 000 0000</a></li>
            <li>Lisboa · São Paulo · Global</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--brand)]">Redes</h4>
          <ul className="space-y-2 text-sm text-[rgba(250,250,252,0.68)]">
            <li><a href="https://instagram.com" className="hover:text-[var(--ink)]" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="https://facebook.com" className="hover:text-[var(--ink)]" target="_blank" rel="noreferrer">Facebook</a></li>
            <li><a href="https://youtube.com" className="hover:text-[var(--ink)]" target="_blank" rel="noreferrer">YouTube</a></li>
            <li><a href="https://linkedin.com" className="hover:text-[var(--ink)]" target="_blank" rel="noreferrer">LinkedIn</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-16 border-t border-[rgba(255,255,255,0.12)] bg-[rgba(6,0,0,0.92)] py-6 text-center text-xs uppercase tracking-[0.28em] text-[rgba(250,250,252,0.5)]">
        © {new Date().getFullYear()} SMARTx · Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
