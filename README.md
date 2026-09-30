# ResQ Grid

> A citizen-facing flood early-warning and safe-route app for Chennai.

**ResQ Grid** tracks your location, warns you early about flood danger, reports predicted risk to the authorities before it happens, and finds the safest route instead of the shortest one.

Built specifically for Chennai's monsoon challenges, ResQ Grid prioritizes clarity, calm communication, and practical safety over raw traffic speed.

---

## ✨ Features

- **Live Location Tracking & Early Warning**: Uses browser geolocation (with graceful fallback to Chennai's Velachery area) to assess real-time risk across 25 flood-prone zones. Displays clear status (`SAFE`, `BE READY`, `DANGER LIKELY`) with estimated water arrival times.
- **Early Reports to Government**: Automatically compiles and forwards early flood-prediction reports to the city authorities (e.g. Greater Chennai Corporation) so emergency crews and pumps can be staged in advance.
- **Citizen Manual Reporting**: Simple 3-step reporting workflow allowing residents to report water logging, blocked drains, road hazards, or fallen trees with immediate submission tracking.
- **Colour-Graded Safe Routes**: Dynamic routing using real A* calculation comparing the shortest route against the flood-safe route. Road segments are micro-segmented and colored by risk grade:
  - 🟢 **0–25% Clear** (`#22C55E`)
  - 🟡 **26–50% Low Risk** (`#FACC15`)
  - 🟠 **51–75% Flood-Prone** (`#F97316`)
  - 🔴 **76–100% Likely Flooded** (`#EF4444`)
  Includes animated directional arrows, worst-segment warning pins, safest bypass checkmarks, and breakdown safety bars.
- **Global Rain Effect**: Tasteful, light-theme full-screen canvas rain effect that dynamically responds to local flood risk (light drizzle for Safe, steady rain for Be Ready, heavy downpour with wind slant for Danger Likely). Features interactive mouse deflection, cursor ripple trails, click splashes with jumping droplets, button press ripples, and top-to-bottom water-wave page transitions.
- **Trilingual Support**: Full translations across English, Tamil (தமிழ்), and Hindi (हिन्दी) for every interface element.
- **Accessibility & Comfort**: Accessible floating **Aa** control to change text sizes (Normal, Large, Extra Large) and toggle the global rain effect on or off with persistent preference saving.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System Tokens (WCAG AA+ compliant, Plus Jakarta Sans typography)
- **Mapping**: Leaflet + MapLibre GL with OpenFreeMap Positron basemap (and Esri light gray raster fallback, completely keyless)
- **3D Graphics**: Three.js & React Three Fiber (floating hero badge)
- **State Management**: Zustand
- **Internationalization**: i18next + react-i18next
- **Icons**: Lucide React

> **Note**: All data currently presented in the application (flood zones, historical records, rainfall forecasts, sensor metrics, and authority reports) is **mock data** designed to demonstrate Chennai-specific flood warning scenarios.

---

## 📁 Folder Structure

```text
ResQ/
├── index.html                      # Root HTML entry with meta tags and Google fonts
├── package.json                    # Project metadata, scripts, and dependencies
├── vite.config.ts                  # Vite build configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── public/                         # Public static assets
└── src/
    ├── main.tsx                    # Application bootstrap & i18n setup
    ├── App.tsx                     # Top-level application layout and tab router
    ├── index.css                   # Global CSS tokens, animations, and typography rules
    ├── types/                      # TypeScript type definitions
    ├── data/
    │   ├── chennaiRoadGraph.ts     # Micro-segmented Chennai road graph & route presets
    │   ├── floodZones.ts           # 25 Chennai flood-prone zones and prediction logic
    │   ├── alerts.ts               # Sample alerts and multilingual records
    │   └── ...
    ├── store/
    │   └── useResQStore.ts         # Central Zustand state store (location, alerts, rain, font)
    ├── hooks/
    │   └── useLocation.ts          # Geolocation watcher and mock movement engine
    ├── pages/
    │   ├── HomePage.tsx            # "Is my area safe right now?" status dashboard
    │   ├── SafeRoutePage.tsx       # Flagship safe route finder and risk-graded map
    │   ├── AlertsPage.tsx          # Real-time alert timeline and notification settings
    │   └── ReportsPage.tsx         # Automated authority dispatches & citizen report form
    ├── components/
    │   ├── layout/
    │   │   ├── GlobalLayout.tsx    # Header, footer, alerts, rain canvas & page wipe wrapper
    │   │   ├── Navbar.tsx          # Header with navigation and language selector
    │   │   ├── RainCanvas.tsx      # Interactive full-screen rain effect with physics
    │   │   ├── PageWaterWipe.tsx   # 600ms blue-teal water-wave transition wipe
    │   │   ├── FloatingTextControl.tsx # Floating Aa text scaler & Rain On/Off toggle
    │   │   ├── SlideDownAlertBanner.tsx # Top emergency alert notification banner
    │   │   └── MobileBottomBar.tsx # Mobile navigation bar
    │   └── ...
    └── i18n/
        └── index.ts                # Translations for English, தமிழ், and हिन्दी
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Setup & Launch
1. Clone the repository:
   ```bash
   git clone https://github.com/Siva-Vidhya/ResQ.git
   cd ResQ
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

---

## 📸 Screenshots

*(Screenshots can be added here)*

| Home Status & Early Warning | Risk-Graded Safe Route Map |
| :---: | :---: |
| *(Add Home page screenshot)* | *(Add Safe Route screenshot)* |

| Automated Authority Reports & Citizen Submission | Trilingual Alert Timeline |
| :---: | :---: |
| *(Add Reports page screenshot)* | *(Add Alerts page screenshot)* |

---

## 📄 License

This project is licensed under the MIT License.
