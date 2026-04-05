# VESTL

**Know before you go.**

VESTL is a physical product — a Raspberry Pi + screen unit designed to be mounted at the entrance of any home or apartment. At a glance, residents get everything they need before stepping outside: next departures for every nearby transit line, current weather, and the time. No phone needed. No unlocking. Just look up.

This repository contains the **display software** that runs on the VESTL device.

![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-blue) ![Raspberry Pi](https://img.shields.io/badge/Runs%20on-Raspberry%20Pi-c51a4a)

## The Hardware

VESTL is designed to run on a **Raspberry Pi** (3B+ or newer) connected to any HDMI screen — from a small 7" touch panel to a full portrait monitor. The software boots into a full-screen Chromium kiosk displaying this dashboard. No keyboard, no mouse, no interaction needed.

**Planned collab editions** — artist series, clothing brand drops, limited hardware finishes. VESTL is both a utility object and a design object.

## ✨ Software Features

- 🚇 **Live Transit Departures** — next U-Bahn / S-Bahn / Tram / Bus from the nearest stop, auto-detected by GPS coordinates
- 🌡️ **Live Weather** — temperature and conditions via Open-Meteo (no API key required)
- 🕐 **Premium Clock Faces** — 30+ styles from Bauhaus to Tourbillon to Neon Plasma
- 🎨 **Berlin Themes** — full-screen SVG landmark illustrations (U-Bahn platform, Fernsehturm, Berliner Dom, Berghain, East Side Gallery and more)
- 🔄 **Auto-refresh** — updates every 60 seconds, no interaction needed
- ⚡ **No backend, no API keys** — works out of the box, fully client-side

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- OpenWeatherMap API key (free tier available)

### Installation

1. **Clone or navigate to the project folder**
   ```powershell
   cd "c:\Users\kraie\Documents\Door info DASH"
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Configure your settings**
   
   Copy `.env.example` to `.env` and add your API key:
   ```powershell
   Copy-Item .env.example .env
   ```
   
   Edit `.env` and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

4. **Set your location and transit stop**
   
   Edit `src/config.ts`:
   ```typescript
   export const config = {
     MY_LAT: 52.5200,  // Your latitude
     MY_LON: 13.4050,  // Your longitude
     OPENWEATHER_API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
     STOP_ID: '900000100003',  // Your BVG/VBB stop ID
     REFRESH_INTERVAL: 60000,
   };
   ```

5. **Start the development server**
   ```powershell
   npm run dev
   ```

6. **Open in browser**
   
   Navigate to `http://localhost:5173`

## 🔑 Getting API Keys

### OpenWeatherMap API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key
5. Add it to your `.env` file

### Finding Your Transit Stop ID

1. Go to [transport.rest API](https://v6.transport.rest/)
2. Use the stops/nearby endpoint:
   ```
   https://v6.transport.rest/stops/nearby?latitude=52.52&longitude=13.40
   ```
3. Replace with your coordinates
4. Find your stop in the results and copy its ID
5. Add it to `src/config.ts`

## 📦 Project Structure

```
Door info DASH/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Main layout wrapper
│   │   ├── TemperatureCard.tsx  # Weather display
│   │   └── DeparturesCard.tsx   # Transit departures
│   ├── hooks/
│   │   ├── useWeather.ts        # Weather data fetching
│   │   └── useDepartures.ts     # Transit data fetching
│   ├── config.ts                # Your configuration
│   ├── types.ts                 # TypeScript definitions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind + custom styles
├── .env                         # Environment variables (not in git)
├── .env.example                 # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🎨 Customization

### Change Refresh Interval

Edit `src/config.ts`:
```typescript
REFRESH_INTERVAL: 30000,  // 30 seconds
```

### Modify Number of Departures

The API call in `src/hooks/useDepartures.ts`:
```typescript
const url = `https://v6.transport.rest/stops/${config.STOP_ID}/departures?results=10&duration=30`;
```

### Styling

All styles use Tailwind CSS. Main theme colors are in `tailwind.config.js`:
- `midnight` - Dark navy background
- `midnight-light` - Lighter navy
- Custom glass effects in `src/index.css`

## 🏗️ Building for Production

```powershell
npm run build
```

The built files will be in the `dist/` folder. You can serve them with any static file server.

To preview the production build:
```powershell
npm run preview
```

## 🖥️ Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Drag & drop `dist/` folder
2. Or connect GitHub repo
3. Set environment variables
4. Deploy!

### Local Kiosk Mode
Run in fullscreen browser (F11) for a dedicated display panel.

## 🛠️ Troubleshooting

**Weather not loading?**
- Check your API key in `.env`
- Verify coordinates in `config.ts`
- Check browser console for errors

**No departures showing?**
- Verify your STOP_ID is correct
- Check if the stop has upcoming departures
- Try the API URL directly in browser

**CORS errors?**
- Both APIs support direct browser requests
- If issues persist, check API documentation

## 📄 License

MIT License - feel free to use and modify!

## 🙏 Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Transit data: [transport.rest](https://transport.rest/)
- Built with React, TypeScript, Vite, and Tailwind CSS

---

**Enjoy your dashboard! 🎉**
