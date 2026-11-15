# SOLFORGE — FLAMEGUARD AI
**NASA Space Apps Challenge 2026 · Flame in Freefall**

An interactive, scientific, educational microgravity combustion research and simulation platform built on peer-reviewed NASA investigations.

---

## 🚀 Features

- **Live Flame Dynamics Lab (`/lab`)**:
  - Interactive Canvas combustion simulation modeling the cessation of buoyant convection.
  - Symmetrical spherical diffusion flame (ISS $\sim 10^{-6} g$) $\leftrightarrow$ transitional lunar/martian forms ($0.166 g$, $0.378 g$) $\leftrightarrow$ buoyant flickering teardrop (Earth $1.0 g$).
  - Real-time physics scaling: $u = \sqrt{g \cdot 981 \cdot L}$ cm/s, $ppO_2 = (O_2\% \cdot P)/100$ kPa.
  - Play/Pause, speed multipliers ($\times 1, \times 5, \times 10$), simulation timer $T+$, automatic cycling demo, event log, and live demo curve.
- **Scientific Data Explorer (`/dashboard`)**:
  - Verified experimental ranges and parameters from official NASA reports:
    - **ACME CLD Flame**: $5\dots 8\times$ soot ratio comparison (limited strictly to cited study).
    - **BASS / BASS-II**: $5\dots 50$ cm/s forced air velocity, $\sim 100$ fuel samples.
    - **Saffire-I**: $0.94 \times 0.4$ m SIBAL fabric sample, $20$ cm/s airflow tunnel burn.
    - **FLEX / FLEX-2**: $10\dots 50\%$ $O_2$ fraction, $0.5\dots 1.0$ atm pressure, cool flame documentation.
    - **SAME / SAME-R**: $30$ samples across 5 materials (Teflon, Kapton, silicone, acrylic, cotton).
    - **SPICE**: $250$ tests and $70+$ distinct smoke-point measurements.
    - **FM2**: $0.166 g$ lunar gravity material flammability test setting.
  - Interactive CSV Data Export (`nasa_combustion_facts.csv`).
- **Deterministic Scenario Relevance Ranking (`/ranking`)**:
  - Contextual matching of NASA investigations across ISS, Moon Base, Pressurized Rover, Spacesuit, and Earth environments.
- **NASA Research Assistant (`/copilot`)**:
  - Curated, source-linked question answering engine grounded in official NASA publications with zero hallucinations and zero API key exposure.
- **Bilingual Interface**:
  - Full Russian (RU) default and English (EN) toggle with `localStorage` persistence.

---

## 🔬 Scientific Integrity & Disclaimer

> **Transparency Notice**:
> The interactive flame visualizer is an **educational schematic**, not a computational fluid dynamics (CFD) numerical simulation or a real-time predictive hazard model. It visualizes qualitative morphology transformations based on buoyancy cessation documented in NASA PSI experiments. No risk probabilities or safety thresholds are invented.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Space Theme
- **Animations**: Framer Motion + HTML5 Canvas (`requestAnimationFrame`)
- **Charts**: Recharts + Custom Canvas u(t) Plotter
- **Routing**: React Router DOM v7 (configured with SPA rewrites for Vercel)

---

## 📦 Local Installation & Development

```bash
# Clone the repository
git clone https://github.com/SOLFORGE-FLAMEGUARD-AI.git
cd flame-in-freefall

# Install dependencies
npm install

# Start local development server
npm run dev

# Run TypeScript checks
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📚 NASA Data Sources

1. **NASA Physical Sciences Informatics (PSI)**: [psi.nasa.gov](https://psi.nasa.gov)
2. **NASA Technical Reports Server (NTRS)**: [ntrs.nasa.gov](https://ntrs.nasa.gov)
3. **NASA Glenn Research Center — Combustion Science**: [nasa.gov/glenn](https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/)
4. **ISS Combustion Science Researcher's Guide**: [NASA Missions](https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/)
