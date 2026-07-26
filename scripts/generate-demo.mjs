// One-off asset generator for docs/demo.gif — drives the running dev server
// via localStorage (same keys App.tsx reads) and screenshots each board skin.
// Usage: npm run dev (in another terminal), then: node scripts/generate-demo.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRAMES_DIR = path.join(__dirname, '..', 'docs', 'frames');
const APP_URL = process.env.VESTL_DEV_URL ?? 'http://localhost:5174';

const BASE_CUSTOMIZATION = {
  clockStyle: 'digital',
  clockSize: 'medium',
  showWeather: true,
  showDepartures: true,
  showDate: true,
  showSeconds: false,
  showComplications: false,
};

// One frame per distinct board skin — see BOARD_VARIANT_MAP in App.tsx
const LAYOUTS = ['bvg', 'bvg-green', 'sbahn', 'nova', 'paper', 'signal', 'bvg-icons', 'bvg-yellow'];

mkdirSync(FRAMES_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1620, height: 540 } });

for (const [i, layout] of LAYOUTS.entries()) {
  await page.goto(APP_URL);
  await page.evaluate(({ layout, base }) => {
    localStorage.setItem('dashboardCustomization', JSON.stringify({ ...base, layout }));
  }, { layout, base: BASE_CUSTOMIZATION });
  await page.reload();
  // Let real departures/weather fetches resolve before capturing.
  await page.waitForTimeout(3000);
  const frame = path.join(FRAMES_DIR, `frame-${String(i).padStart(2, '0')}-${layout}.png`);
  await page.screenshot({ path: frame });
  console.log('captured', frame);
}

await browser.close();
