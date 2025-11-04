# SMARTx — Hub integrado de conteúdo e e-commerce B2B

SMARTx reúne o blog público, a loja profissional e o painel do músico em uma única experiência.

## Stack principal

- **Frontend**: React 18 + TypeScript, Vite, Tailwind (dark mode), shadcn/ui, React Router, React Query.
- **Backend**: Supabase (Auth, Postgres com RLS, Storage, Edge Functions).
- **Editor**: React Quill para CMS e formulários com React Hook Form.

## Configuração

1. Instale dependências:

```bash
npm install
```

2. Configure o arquivo `.env` com as credenciais Supabase:

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

3. Rode o ambiente de desenvolvimento:

```bash
npm run dev
```

4. Para build de produção:

```bash
npm run build
```

## Módulos principais

- **/blog** – listagem com SEO, página de post com JSON-LD e CMS completo em `/admin/blog`.
- **/store** – catálogo público; preços e checkout apenas para profissionais aprovados.
- **/dashboard** – painel do músico com atualização do perfil artístico e solicitação de verificação.
- **/admin** – gestão de verificações, produtos, pedidos e conteúdo editorial.

## Supabase

- Migrações SQL em `supabase/migrations` criam tabelas, RLS e RPCs.
- Edge Function `request-professional-verification` trata upload de anexos e upsert de solicitações.
- Buckets de Storage: `verifications` (privado), `blog` e `products` (públicos).

## Scripts úteis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor local com hot reload |
| `npm run build` | Build de produção |
| `npm run preview` | Pré-visualização do build |

## Licença

Projeto interno SMARTx. Ajuste conforme políticas do seu time antes de publicar.
