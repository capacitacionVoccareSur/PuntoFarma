# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Punto Farma** (also branded as **Punto Salud**) is a telemedicine and virtual medical coverage service operating in Paraguay. This folder contains two things: a standalone HTML dashboard and a modern React rebuild of that dashboard.

## Two Codebases

### 1. `panel.html` — Standalone Dashboard (no build step)

Single self-contained HTML file. Open directly in the browser. External deps via CDN:
- **Google Fonts** — Inter
- **Three.js r0.177** — via `<script type="importmap">` → `cdn.jsdelivr.net`

**Bento grid layout** (12-column CSS Grid, `grid-auto-flow: dense`):

| Card | Class | Grid span |
|------|-------|-----------|
| Speech + validation guide | `.c-speech` | col 6, row 2 |
| Links rápidos | `.c-links` | col 6 |
| Especialidades + costos | `.c-espec` | col 6, row 2 |
| Programas Base/Full | `.c-prog` | col 4 |
| Disponibilidad | `.c-disp` | col 4 |
| Recordatorios | `.c-rec` | col 6 |
| Madrugada (overnight) | `.c-mad` | col 6 |

**3D icons** — Each card header has `<canvas class="icon-3d" id="i-*">` rendered by Three.js (`makeIcon()`). Geometries: RoundedBox, TorusKnot, Icosahedron, Torus, Sphere, Cone — all `MeshPhysicalMaterial` with `setAnimationLoop`.

**Modals** — `.overlay` + `.modal`, toggled via `openModal(id)` / `closeModal(id)`, closed by ESC or backdrop click.
- `m-prog` — Program comparison table (overlay defined)
- `m-checklist`, `m-espec` — Buttons exist in `.c-links` but overlay divs not yet added

**Known issues:**
- Some modal text has mojibake (`Â·`, `â€"`) — UTF-8 encoding mismatch in those strings
- Logo `<img src="BASE64">` is a placeholder; the real file has an inline base64 data URI

### 2. `Rediseño Figma punto farma/` — React Rebuild

Modern React + TypeScript + Vite + Tailwind CSS v4 app. Use **npm** to run (pnpm not in PATH).

**Commands** (run from inside `Rediseño Figma punto farma/`):
```
npm run dev      # dev server (currently on :5174)
npm run build    # production build
npm run preview  # preview production build
npm run format   # format with oxfmt
```

**Stack:**
- React 19, TypeScript (strict), Vite 8
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin — no `tailwind.config.js`)
- `oxfmt` for formatting (not Prettier)
- Path alias: `@` → `src/`

**Architecture** — single-file app:
- `src/App.tsx` — all UI, data arrays, modal state, `Icon` and `StepMedia` components
- `src/index.css` — all styles (`@theme` tokens + hand-written CSS; no Tailwind utility classes in JSX)

**Key components in App.tsx:**
- `Icon` — inline SVG icon set (arrow, external, info, chevron, close)
- `StepMedia` — renders a step screenshot with fallback placeholder; images go in `public/` and are referenced by `src` prop

**Layout:**
- `.app-shell` is `height: 100dvh; display: flex; flex-direction: column; overflow-y: auto` — prevents scroll when accordions are collapsed; sticky header works within this scroll context
- `.bento-grid` two-column `7fr 5fr`: `.card-speech` left, `.right-col` stacks the rest right

**Design system** (`index.css` `@theme` block):
- Colors: `--color-page #edf1fc`, `--color-ink #202d54`, `--color-accent #5134a9`, `--color-blue #2c4ca2`, `--color-celeste #00a9e4`, `--color-verde #079968`
- Glassmorphism: `--glass`, `--glass-blue`, `--glass-purple`, `--glass-green`, `--glass-dark`
- Border radius: `--radius-card: 22px`
- Responsive breakpoints: `960px` (single column), `720px` (stack speech layout)

**Modals** — `asignModal` and `medicaiaModal` state booleans. Dismiss via overlay click, ESC, or close button.
- `.modal-link` — CSS class for inline links inside modal step descriptions
- `.modal-media-slot` — image container (`min-height: 170px`, dashed border as placeholder)
- `.modal-media-img` — image at `width: 85%; object-fit: contain`
- `.media-loaded` — applied when image loads; removes dashed border/background

**Modal "¿Cómo asignar servicios en SOA?"** — 9-step SOA assignment process:
1. Verificar datos del expediente (mail, Central/Asunción, Programado)
2. Consultar disponibilidades (links to página de disponibilidades y pagos)
3. Revisar info del médico + confirmar disponibilidad
4. Asignar en SOA — botón calendario desde sugerencia (NOT Asignación Manual)
5. O asignar desde búsqueda manual
6. Seleccionar día y hora
7. Elegir horario exacto (fracciones de 10 min)
8. Reservar turno → Medicaia auto-assigns + email to affiliate + video link 10 min before
9. Monitoreo y satisfacción

Screenshots: `public/Asignación SOA/1.png` … `public/Asignación SOA/9.png`

**Modal "¿Cómo asignar desde Medicaia? (En caso de que no funcione el SOA)"** — 5 steps:
1. Ingresar a la plataforma Medicaia
2. Buscar al paciente por número de documento o nombre
3. Seleccionar el afiliado con el botón
4. Completar especialidad, médico, fecha y hora coordinada
5. Revisar y confirmar → mail de registro + link de cita 10 min antes

Screenshots: `public/Asignación Medicaia/1.png` … `public/Asignación Medicaia/5.png`

**Links card** — "Página de costos y horarios de médicos" links to the Google Script turnos page.

**Numbers:** All step and question numbers display without leading zeros (1, 2, 3… not 01, 02, 03).

**Logo** — `public/logo.png` (present). Referenced with `` src={`${import.meta.env.BASE_URL}logo.png`} `` to work on GitHub Pages.

**Favicon** — `public/favicon.svg`: white cross on blue (`#2c4ca2`) rounded square. Linked in `index.html` as `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` (Vite auto-prefixes base path on build).

## GitHub Pages Deployment

- Live URL: `https://capacitacionvoccaresur.github.io/PuntoFarma/`
- Repo: `https://github.com/capacitacionVoccareSur/PuntoFarma`
- Auto-deploy via `.github/workflows/deploy.yml` on push to `master`
- **Requires**: Settings → Pages → Source = **GitHub Actions** (must be set manually once in repo settings)
- `vite.config.ts` has `base: '/PuntoFarma/'` — all public asset URLs must use `import.meta.env.BASE_URL` prefix
- Workflow uses `run: cd "Rediseño Figma punto farma" && npm ci && npm run build` (avoids `working-directory` with `ñ` char which fails on Ubuntu runner)

## Other Files

- **`dump_prog.txt`** — Earlier flat-design version of `panel.html`. Reference backup only.
- **`diag_full.ps1`** — PowerShell script to inspect `panel.html` content during development.
- **`Punto Salud _ Disponibilidad Médica.html`** — Saved page from the platform showing specialist availability.
- **`RE-GSC-TR-02 Actualización final de Punto Farma .pdf`** — Official program update document.

## Key Domain Context

- Platform URL: `https://puntofarma.medicaia.com/`
- Patient validation via **SOA** using national ID (cédula); unresolved cases are escalated
- Phone numbers always entered with `09...` prefix
- Expediente created with address **Central / Asunción** in entities 1 and 2
- **Programa Base** — general + specialists, second opinion, scheduling
- **Programa Full** — Base + 3 Nutrición services (Crónicas, Infantil, Peso)
- Only the plan **titular** (account holder) is attended; Pediatría requests are escalated to filial
- SOA assignment uses the **calendar button** (not "Asignación Manual"); after "Reservar turno" Medicaia auto-assigns and emails the affiliate
