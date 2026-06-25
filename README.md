# Premium Responsive i18n Landing Page & Recruitment Platform

A production-ready, high-performance web application designed for a localized service business. This project showcases advanced front-end engineering, robust serverless security integrations, zero-dependency client-side internationalization (i18n), and enterprise-grade fail-safe architectures.

Developed with a strong emphasis on clean code, accessibility (a11y), search engine optimization (SEO), and premium user experiences.

---

## ⚠️ Proprietary Notice & Usage Restrictions

> **IMPORTANT:** This repository and all associated code are **strictly proprietary**. Unauthorized copying, modification, distribution, or commercial reuse of this codebase—in whole or in part—is explicitly prohibited. 
>
> All intellectual property, architectural patterns, and custom configurations are owned exclusively by the developer and the designated business entity.

### 🎯 Purpose of This Documentation
This `README.md` and the accompanying code layout serve two specific functions:
1. **Proof of Work & Portfolio Showcase:** Demonstrates engineering competence, full-stack security implementations, and modern production-ready development practices.
2. **Internal Maintenance Ledger:** Provides structured, technical documentation to streamline future maintenance, feature enhancements, and updates for the authorized production environment.

---
## 🚀 Key Architectural Features

### 1. Zero-Dependency Client-Side i18n (Bilingual EN/ES)
- **High-Performance CSS-Driven Rendering**: Avoids the "flash of untranslated content" (FOUT) by embedding bilingual strings natively in the DOM and toggling visibility dynamically via localized attribute selectors (`html[lang="es"]`).
- **State Persistence**: Uses HTML5 `localStorage` to remember language preferences across user sessions, coupled with browser language auto-detection for an intuitive first-visit experience.
- **SEO-Optimized**: Both English and Spanish text exist statically in the HTML document, allowing search crawlers (Google, Bing) to index all semantic content in both languages without requiring complex server-side rendering (SSR) overhead.

### 2. Secure Serverless Form Processing (Cloudflare Pages Functions)
- **Zero Client-Side Secret Leakage**: Integrated a secure proxy endpoint using **Cloudflare Pages Functions** (`/functions/api/submit.js`) written in JavaScript (ES Modules).
- **Backend Token Validation**: Resolves and verifies **Cloudflare Turnstile** bot protection tokens server-side, preventing client spoofing and keeping Turnstile private keys 100% secure.
- **Payload Sanitization & Forwarding**: Automatically filters compatibility tokens (e.g. hCaptcha backward compatibility layers) and routes validated applicant and booking payloads to Web3Forms.

### 3. Fail-Safe API Fallback Architecture
- **Resilience Engineering**: Built to handle scenarios where third-party APIs (Web3Forms, network connection) fail or monthly submission limits are reached.
- **Graceful Degradation**: Instead of showing a generic error, the system catches failure status codes and presents an interactive "manual submission" container.
- **Enhanced UX under Failure**: The fallback UI compiles the user's input, provides a single-click copy box, and instructs the user to send the information directly to the target email address—ensuring **0% lead drop-off**.

### 4. Modern, Responsive Styling & Micro-interactions
- **Custom Design System**: Structured with CSS Custom Properties (Variables) for colors, spacing tokens, shadow elevations, transitions, and border-radius presets.
- **Fluid Layouts**: Flexbox and Grid layouts built from the ground up, utilizing adaptive breakpoints (such as switching to a hamburger menu overlay at `1100px` to prevent layout cramping).
- **Rich Aesthetics**: Utilizes CSS backdrop-filters (glassmorphism), hover scale effects (`hover-lift`), and smooth ease-in-out animations.

---

## 🛠 Tech Stack

- **Front-End**: HTML5 (Semantic Markup), CSS3 (Modern Flexbox/Grid, Custom Properties), JavaScript (Vanilla ES6+, LocalStorage, Fetch API)
- **Serverless/Backend**: Cloudflare Pages Functions (V8 Worker runtime)
- **Third-Party Integrations**: Cloudflare Turnstile (Bot Protection), Web3Forms API
- **Tooling/Hosting**: Cloudflare Pages (Continuous Integration / Continuous Deployment)

---

## 📁 File Structure

```bash
├── functions/
│   └── api/
│       └── submit.js     # Serverless Cloudflare Pages Function (Turnstile verification)
├── index.html            # Main bilingual landing page (Services, Areas, Booking)
├── jobs.html             # Application page (Complex, validated multi-step application form)
├── script.js             # Client-side core logic (i18n engine, validation, API fallback)
├── styles.css            # Custom responsive design stylesheet (Fluid Layout, Animations)
└── README.md             # Project documentation and engineering overview
```

---

## 💻 Local Setup & Development

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd gc-cleaning-services
   ```

2. **Serve locally:**
   Since the app uses client-side javascript routing and fetch APIs, you can serve the root directory with any local development server (e.g., Live Server in VS Code, or Python's HTTP server):
   ```bash
   # Python 3
   python -m http.server 8000
   ```

3. **Deploying Serverless Functions (Cloudflare Wrangler):**
   To test the serverless function locally, use the Cloudflare Wrangler CLI:
   ```bash
   npm install -g wrangler
   wrangler pages dev .
   ```

4. **Environment Variables**:
   Configure these environment variables in your Cloudflare Pages dashboard under **Settings > Environment Variables**:
   - `TURNSTILE_SECRET_KEY`: Private key for Cloudflare Turnstile token validation.
   - `WEB3FORMS_ACCESS_KEY`: Access token for the Web3Forms API gateway.

