# PearDock Frontend

Front end for **PearDock**, a decentralized GPU rental marketplace ("Reduce AI Costs with Decentralized GPUs"). Users can browse GPU listings, pay for a GPU through a checkout flow, and hosts can list their own GPUs. The app talks to a separate backend API (not included in this repository).

> **Status:** early-stage. Login is a client-side check (no real authentication backend), several pages (Blog, Docs, Contact) are placeholders, and the GPU/Region filters on the Buy page use placeholder options.

## Features

| Route | Page | Description |
| --- | --- | --- |
| `/` | Home | Full-screen video hero. Protected: redirects to `/login` unless signed in |
| `/login` | Login | Email/password form with validation; sets an `authentication` flag in `localStorage` on success |
| `/signup` | Signup | Name/email/password/confirm form with client-side validation (not connected to a backend) |
| `/buy-gpu` | Buy GPU | Filters (GPU/region dropdowns, range sliders, radio options) and a sortable, paginated table of GPUs fetched from the backend, with a deploy/buy action per row |
| `/add-gpus` | Add GPU | Form for hosts to list a GPU: host machine, GPU model, vCPU, RAM, network, storage, price (INR), duration and key |
| `/blog`, `/docs`, `/contact` | Placeholders | Title-only pages |

### Purchase flow

1. Clicking a row's action on `/buy-gpu` posts the GPU and price data (currency INR) to the backend's `create-payment-intent` endpoint.
2. On success the browser is redirected to the returned checkout URL.
3. When the user returns with a `?paymentId=...` query parameter, the app queries the backend `status/:paymentId` endpoint and, if paid, shows the GPU's access key in a copy dialog (`CopyModal`).
4. Failure and "already purchased" cases show a payment-failed modal.

## Backend API

The frontend expects a backend running at `http://localhost:8282` (hard-coded in the source, no environment variable yet) exposing:

| Method | Path | Used by |
| --- | --- | --- |
| `GET` | `/gpus` | `src/pages/Buy.tsx` – list GPUs |
| `POST` | `/add-gpus` | `src/pages/GPUBuy.tsx` – add a GPU listing (expects `201` on success) |
| `POST` | `/create-payment-intent` | `src/components/Table.tsx` – start checkout, returns `success` and `checkoutUrl` |
| `GET` | `/status/:paymentId` | `src/components/Table.tsx` – returns `isPaid` and `key` |

The backend implementation and its repository location need confirmation.

## Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- React Router 7
- [Tailwind CSS](https://tailwindcss.com/)
- MUI (Material UI) 6 with the styled-components engine (`@mui/styled-engine-sc`, aliased in `vite.config.ts`)
- axios / fetch for HTTP, lucide-react and MUI icons

## Getting started

Requirements: Node.js and npm, plus the backend API on port 8282 for GPU listing and payments.

```sh
npm install
npm run dev
```

Vite serves the app on its default port (5173).

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc -b`) and build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

No test script is configured.

## Configuration

No environment variables are read. The API base URL is hard-coded as `http://localhost:8282` in `src/pages/Buy.tsx`, `src/pages/GPUBuy.tsx` and `src/components/Table.tsx`; change it there to point at another backend.

## Project structure

```
src/
  App.tsx          # Routes and localStorage-backed auth flag
  pages/           # Home, Login, Signup, Buy, GPUBuy (add GPU), Blog, Docs, Contact
  components/      # Header, Footer, Layout, ProtectedRoute, Table, CopyModal, PaymentFailedModal, Dropdown, RangeSlider, Radiogroup
  assets/          # Icons
```
