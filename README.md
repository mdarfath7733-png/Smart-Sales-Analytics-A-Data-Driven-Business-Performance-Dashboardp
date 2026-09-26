# PrismMetrics - Smart Sales Analytics Dashboard & SaaS Platform

> **Transform Raw Sales Data Into Predictable Revenue**  
> Modern, enterprise-grade sales analytics web application and high-conversion SaaS landing page featuring AI-powered predictive forecasting, real-time pipeline telemetry, and churn intelligence.

---

## 🌟 Key Highlights & Design Aesthetic

- **Aesthetic**: Futuristic dark mode first (Deep space navy `#060913`, `#0A0F1E`) paired with vibrant neon accents:
  - ⚡ **Electric Blue / Cyan** (`#00F0FF`, `#38BDF8`): Revenue telemetry & primary brand glow.
  - 🌿 **Mint Green** (`#00F5A0`, `#10B981`): AI predictive forecasting, positive growth vectors & retention metrics.
  - 🔮 **Electric Violet** (`#A855F7`, `#8B5CF6`): Targets, quotas, and machine learning confidence ribbons.
- **Self-Contained & Resilient**: Zero external CDN failure risk. Built with native responsive CSS, SVG icons, and a custom high-DPI HTML5 Canvas data visualization engine.
- **Responsive Layout**: Pixel-perfect presentation across mobile, tablet, desktop, and ultra-wide screens.

---

## 🚀 Live Interactive Features

1. **Real-Time Revenue Telemetry**:
   - Live revenue ticker simulating continuous micro-sales events every few seconds.
   - Dynamic time-range switches (`7D`, `30D`, `QTD`, `YTD (2026)`).
   - Core metrics: Real-time Revenue (`$1,428,950`), ARR (`$5.71M`), Win Rate (`64.8%`), and Customer Health Index (`92.4/100`).

2. **Interactive Data Visualizations**:
   - **Monthly Revenue Trajectory Chart**:
     - Actual revenue curve with glowing neon gradient area.
     - Dotted violet quota target line.
     - Neon mint AI forecast curve with shaded confidence band ribbon.
     - Interactive cursor crosshair and floating real-time breakdown tooltip on hover.
   - **Regional Performance Bar Chart**:
     - Attainment across North America, EMEA, APAC, and LATAM with quota thresholds and hover highlights.

3. **AI Predictive Sales Forecast Copilot**:
   - Badge: `Prediction: 24% Q3 growth expected (94.8% confidence)`
   - Interactive Scenario Simulator buttons:
     - `Base (+24%)`: Standard machine learning projection.
     - `🚀 Bull (+32%)`: Aggressive expansion model with re-calculated curves.
     - `⚠️ Stress Test (-11%)`: Macro headwinds with tactical SDR re-allocation advice.

4. **Instant Pipeline Visualizer (Interactive Kanban)**:
   - Live drag-and-drop deal management across 4 stages (`Discovery`, `Value Proposition`, `Proposal`, `Closed Won`).
   - One-click `←` and `→` fallback controls for mobile and quick navigation.
   - Dynamic automatic recalculation of total pipeline value (`$1.47M`), weighted ARR (`$1.02M`), and active deal counts.

5. **Customer Health Score Matrix & Churn Radar**:
   - Live searchable enterprise account table with health score meters (0-100), churn risk ratings, and one-click retention playbook triggers.

6. **1-Click Integrations Hub**:
   - Bi-directional sync with Salesforce, HubSpot, Stripe Billing, and Snowflake Data Lake.
   - Interactive `Active Sync` / `Connect` toggle states with instant toast confirmations.

7. **Interactive ROI & Value Calculator**:
   - Dynamic pipeline volume slider ($1M – $50M+) calculating recovered revenue leakage, rep hours saved, and estimated payback period in real-time.

8. **Annual vs Monthly Billing Switcher**:
   - 20% discount calculation with 2 months free badge and instant pricing updates.

---

## 📂 Project Architecture

```
├── index.html       # Semantic HTML5 SaaS landing page & app interface
├── styles.css       # Enterprise dark-mode design system with neon glow tokens
├── charts.js        # Custom Retina Hi-DPI Canvas visualization engine
├── pipeline.js      # Interactive Kanban drag-and-drop pipeline manager
├── app.js           # UI controller, telemetry simulation, ROI calculator & modals
├── server.js        # Zero-dependency local Node.js static preview server
└── package.json     # Project configuration and launch scripts
```

---

## 💻 How to Run Locally

### Option 1: Zero-Dependency Node.js Server (Recommended)
```bash
npm start
```
Then open your browser at:  
👉 **http://localhost:3000**

### Option 2: Direct Browser Launch
Simply double-click `index.html` in your file explorer or open it directly in Chrome, Edge, Safari, or Firefox without any build step!
