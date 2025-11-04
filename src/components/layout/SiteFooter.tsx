export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} SMARTx. Todos os direitos reservados.</span>
        <span className="text-zinc-600">Construindo oportunidades para profissionais da música.</span>
      </div>
    </footer>
  );
}

export default SiteFooter;
