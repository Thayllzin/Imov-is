# Marcela Cardoso Imóveis — Plataforma Imobiliária (React + TypeScript + Vite + Supabase)

Sistema imobiliário completo, responsivo e pronto para produção na **Vercel**, integrado com **Supabase Database**, **Supabase Auth** e **Supabase Storage**.

---

## 1. Requisitos

- **Node.js** 18+ instalado
- Conta gratuita no [Supabase](https://supabase.com/)
- Conta gratuita na [Vercel](https://vercel.com/)

---

## 2. Instalação Local

```bash
# 1. Instale as dependências
npm install

# 2. Copie o arquivo de variáveis de ambiente de exemplo
cp .env.example .env

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

---

## 3. Como Configurar o Supabase (Passo a Passo)

### Passo 3.1 — Criar Projeto no Supabase
1. Acesse [https://supabase.com/dashboard](https://supabase.com/dashboard) e clique em **New project**.
2. Escolha o nome (ex.: `marcela-cardoso-imoveis`), defina uma senha forte para o banco e selecione a região (`South America (São Paulo)`).
3. Aguarde a criação do projeto finalizar.

### Passo 3.2 — Criar Tabelas, Bucket de Storage e Políticas RLS
1. No menu lateral esquerdo do Supabase, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste projeto, copie **todo** o seu conteúdo e cole no editor SQL do Supabase.
4. Clique no botão **Run** (ou pressione `Ctrl + Enter` / `Cmd + Enter`).
5. Esse script criará automaticamente:
   - A tabela `properties` (com todos os campos, índices e trigger de `updated_at`);
   - A tabela `property_images` (com vínculo `ON DELETE CASCADE`);
   - As políticas de segurança **Row Level Security (RLS)** permitindo leitura pública e escrita restrita a usuários autenticados;
   - O bucket público **`property-images`** no **Supabase Storage** e suas políticas de upload/exclusão.

### Passo 3.3 — Criar Usuário Administrador (Supabase Auth)
1. No menu lateral esquerdo do Supabase, clique em **Authentication** -> **Users**.
2. Clique no botão **Add user** (canto superior direito) -> **Create new user**.
3. Preencha o **Email** (ex.: `contato@marcelacardosoimoveis.com.br`) e a **Password** desejada.
4. Deixe a opção **Auto Confirm User** marcada.
5. Clique em **Create user**. Pronto! Use esse e-mail e senha para acessar `/login` no site.

### Passo 3.4 — Obter as Chaves de API (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`)
1. No menu lateral esquerdo do Supabase, clique em **Project Settings** (ícone de engrenagem) -> **API**.
2. Copie o valor de **Project URL** e coloque em `VITE_SUPABASE_URL`.
3. Em **Project API keys**, copie a chave **`anon` / `public`** e coloque em `VITE_SUPABASE_ANON_KEY`.
   > **ATENÇÃO DE SEGURANÇA:** Nunca utilize a chave `service_role` no frontend.

---

## 4. Variáveis de Ambiente (`.env`)

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
VITE_SUPABASE_URL="https://seu-projeto.supabase.co"
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica-aqui"
VITE_WHATSAPP_NUMBER="559182509618"
```

---

## 5. Como Publicar na Vercel

1. Suba este repositório para o seu **GitHub**, **GitLab** ou **Bitbucket**.
2. Acesse [https://vercel.com/new](https://vercel.com/new) e importe o repositório.
3. Em **Framework Preset**, mantenha **Vite**.
4. Abra a seção **Environment Variables** e adicione:
   - `VITE_SUPABASE_URL` = URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY` = Chave `anon public` do seu projeto Supabase
   - `VITE_WHATSAPP_NUMBER` = Número do WhatsApp com DDI e DDD (ex.: `559182509618`)
5. Clique em **Deploy**.
6. O arquivo `vercel.json` na raiz já está configurado com *rewrites* para SPA (`/(.*)` -> `/index.html`), garantindo que rotas como `/imoveis`, `/imovel/meu-imovel` e `/admin` funcionem diretamente ao recarregar a página.

---

## 6. Como Cadastrar o Primeiro Imóvel

1. Acesse `https://seu-dominio.vercel.app/login` (ou `http://localhost:3000/login`).
2. Entre com o e-mail e senha criados no **Supabase Auth**.
3. No painel (`/admin`), clique em **Cadastrar Novo Imóvel** (ou em **Importar Imóveis de Exemplo** se desejar carregar os imóveis iniciais de demonstração).
4. Preencha título, descrição, tipo, finalidade, valores, endereço, cômodos, diferenciais e selecione múltiplas fotos.
5. Escolha qual foto será a **Capa Principal** e clique em **Salvar Imóvel**.

---

## 7. Como Personalizar o Sistema

- **Trocar número do WhatsApp, telefone, CRECI e endereço:**
  Edite o arquivo [`src/config/siteConfig.ts`](./src/config/siteConfig.ts) ou defina `VITE_WHATSAPP_NUMBER` nas variáveis de ambiente.
- **Trocar nome/logo da imobiliária:**
  Edite `brandName` e `brandFullTitle` em [`src/config/siteConfig.ts`](./src/config/siteConfig.ts) e o componente [`src/components/Header.tsx`](./src/components/Header.tsx).
- **Trocar cores e fontes:**
  As fontes e variáveis globais estão configuradas em [`index.html`](./index.html) e [`src/index.css`](./src/index.css).
- **Configurar quais status aparecem na busca pública:**
  Altere o array `defaultPublicStatuses` em [`src/config/siteConfig.ts`](./src/config/siteConfig.ts).
