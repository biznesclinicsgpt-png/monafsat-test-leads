import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const TOKEN = 'OTI6cHJvdmlkZXIyMUBvdXRsb29rLmNvbTpwcm92aWRlcjoxNzcxNTAzMDEyMjcx';
const BASE_URL = 'https://www.monafsat.com';
const OUTPUT_DIR = path.resolve('public/monafsat');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const PAGES = [
    { name: 'dashboard', url: '/app/provider/dashboard' },
    { name: 'contacts', url: '/app/provider/contacts' },
    { name: 'leads', url: '/app/provider/leads' },
    { name: 'opportunities', url: '/app/provider/opportunities' },
    { name: 'projects', url: '/app/provider/projects' },
];

(async () => {
    console.log('🚀 Starting Monafsat Capture...');
    const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/Users/1a1132/.cache/puppeteer/chrome/mac_arm-145.0.7632.77/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
        defaultViewport: { width: 1920, height: 1080 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // 1. Authenticate via Token Injection
    console.log('🔐 Authenticating...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle0' });

    await page.evaluate((token) => {
        localStorage.setItem('token', token);
        // Sometimes apps utilize cookies or other storage keys
        // Let's try to set a cookie as well just in case, though localStorage is standard for JWT
        document.cookie = `token=${token}; path=/; domain=.monafsat.com`;
    }, TOKEN);

    console.log('✅ Token injected. Navigating to Dashboard...');

    // 2. Capture Pages
    for (const p of PAGES) {
        const url = `${BASE_URL}${p.url}`;
        console.log(`📸 Capturing: ${p.name} (${url})`);

        try {
            await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

            // Wait for content to load (skeleton to disappear)
            // waiting for a common element like "sidebar" or "header"
            await page.waitForSelector('main', { timeout: 10000 }).catch(() => console.log('⚠️ Main content not found immediately'));

            // Artificial delay for animations/data fetch
            await new Promise(r => setTimeout(r, 5000));

            // Screenshot
            await page.screenshot({
                path: `${OUTPUT_DIR}/${p.name}.png`,
                fullPage: false // Capturing viewport is often better for "Promo" feel, but fullPage is safer
            });
            console.log(`✅ Saved ${p.name}.png`);
        } catch (e) {
            console.error(`❌ Failed to capture ${p.name}:`, e.message);
        }
    }

    await browser.close();
    console.log('✨ Capture Complete!');
})();
