interface LoadMoreProps {
  onClick: () => void;
  busy?: boolean;
  hidden?: boolean;
  label?: string;
}

export default function LoadMore({ onClick, busy, hidden, label = "Carregar mais" }: LoadMoreProps) {
  if (hidden) return null;
  return (
    <div className="loadmore-wrap">
      <button type="button" className="btn loadmore-btn" onClick={onClick} disabled={busy} aria-busy={busy}>
        {busy ? "Carregando…" : label}
      </button>
    </div>
  );
}
