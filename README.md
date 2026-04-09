# LegaldocsGPT

AI-powered legal document generation platform. Pick a template, fill in the details, and get a ready-to-review document in seconds - with a built-in editor, PDF export, and full version history.

**Live demo:** _coming soon_
**Demo account:** `demo@legaldocsgpt.com` / `Demo1234`

---

## Features

- **AI document generation** - fill a form, the backend calls an LLM and produces a fully formatted legal document
- **Built-in document editor** - powered by OnlyOffice; edit the generated document in-browser
- **AI refinement** - send a follow-up prompt to revise the document without starting over
- **Version history** - every generation and refinement is saved; restore any previous version
- **PDF export** - convert and download any document as a PDF
- **Template management** - admins can create, edit, and delete document templates
- **Google OAuth2** - sign in with Google in addition to username/password
- **Forgot/reset password** - full email-based password reset flow
- **Role-based access** - user and admin roles, admin routes protected at middleware level
- **Mobile responsive** - works on phone, tablet, and desktop

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript |
| Styling | Tailwind CSS v4, class-variance-authority |
| Forms | React Hook Form + Zod |
| HTTP | Axios with 401 interceptor |
| Document editor | OnlyOffice Document Server |
| Backend | Spring Boot, Spring Security |
| Auth | Cookie-based JWT, Google OAuth2 |
| Database | PostgreSQL |
| AI | LLM API (document generation + refinement) |

---

## Architecture

```
Browser
  |
  v
Next.js (Vercel)
  |-- middleware (auth guard, role check)
  |
  v
Spring Boot API
  |-- /api/auth       (login, signup, OAuth2, password reset)
  |-- /api/documents  (generate, finalize, versions, PDF)
  |-- /api/templates  (CRUD, admin only)
  |-- /api/storage    (file download)
  |
  +---> PostgreSQL
  +---> LLM API (document generation + refinement)
  +---> OnlyOffice Document Server (editor)
  +---> SMTP (password reset emails)
```

---

## Local Setup

### Prerequisites

- Node.js 20+
- A running instance of the backend (see backend repo)
- OnlyOffice Document Server (optional, needed for the editor)

### 1. Clone and install

```bash
git clone https://github.com/your-username/legaldocsgpt-frontend
cd legaldocsgpt-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_ONLYOFFICE_URL=http://localhost:8089
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  app/
    (pages)/        # Route groups (login, signup, dashboard, documents, profile, admin)
    components/
      ui/           # Design system primitives (Button, Input, Card, Badge, Alert, ...)
      layout/       # Shared layouts (AuthLayout)
    hooks/          # Custom hooks (useDocumentPolling)
    lib/            # API client, Zod schemas, constants, utils
    types/          # Shared TypeScript types
```

---

## UI Component Library

The project uses a custom design system built on Tailwind CSS and `class-variance-authority`:

| Component | Variants |
|-----------|---------|
| `Button` | primary, secondary, destructive, outline, ghost, link / sm, md, lg, icon |
| `Badge` | success, danger, warning, info, brand, default / optional pulse |
| `Alert` | error, success, warning, info - auto-selects icon |
| `Input` / `Textarea` / `Select` | default + error state |
| `FormField` | wraps label, input, error message, hint with correct aria |
| `Card` | with CardHeader and CardTitle |
| `Spinner` / `PageSpinner` | inline and full-page loading states |

---

## Security

- All protected routes validated server-side in middleware before rendering
- Admin routes require `ROLE_ADMIN` claim in JWT
- CSP headers, X-Frame-Options, X-Content-Type-Options, Referrer-Policy set on every response
- Axios 401 interceptor redirects to login on session expiry and preserves the original URL
- Password reset tokens stripped from browser history after use

---

## Scripts

```bash
npm run dev      # start dev server with Turbopack
npm run build    # production build
npm run start    # serve production build
npm run lint     # ESLint
```
