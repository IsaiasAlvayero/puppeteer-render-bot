const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const COOKIE_PATH = path.join(__dirname, 'cookies.json');

app.get('/', async (req, res) => {
  console.log('🌐 Incoming request — launching Puppeteer');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();

  // Try loading existing cookies
  try {
    const cookies = JSON.parse(await fs.readFile(COOKIE_PATH));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded.');
  } catch (err) {
    console.log('⚠️ No cookies found. Starting fresh login...');
  }

  // Navigate to InVideo
  await page.goto('https://ai.invideo.io', { waitUntil: 'networkidle2' });

  // Check login status
  const currentURL = page.url();
  if (currentURL.includes('dashboard')) {
    console.log('✅ Already logged in');
  } else {
    console.log('🕒 Waiting for manual login...');
    await page.waitForTimeout(30000); // give you time to login manually

    const cookies = await page.cookies();
    await fs.writeFile(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Cookies saved for future sessions.');
  }

  await browser.close();
  res.send('✅ Puppeteer login sequence complete. Check Railway logs.');
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer bot running on port ${PORT}`);
});
