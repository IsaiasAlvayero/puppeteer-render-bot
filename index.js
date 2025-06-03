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
    headless: 'new', // modern headless mode
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080'
    ]
  });

  const page = await browser.newPage();

  // Load saved cookies if available
  try {
    const cookies = JSON.parse(await fs.readFile(COOKIE_PATH));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded.');
  } catch (err) {
    console.log('⚠️ No cookies found. Starting fresh login...');
  }

  // Navigate to InVideo AI
  await page.goto('https://ai.invideo.io', { waitUntil: 'networkidle2' });

  // Check if already logged in
  const currentURL = page.url();
  if (currentURL.includes('dashboard')) {
    console.log('✅ Already logged in — continuing...');
  } else {
    console.log('🕒 Waiting for manual Google login (30 seconds)...');
    await page.waitForTimeout(30000); // Allow time for manual login

    // Save cookies for future use
    const cookies = await page.cookies();
    await fs.writeFile(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Cookies saved for future sessions.');
  }

  // Placeholder for automation steps
  console.log('🚧 Login flow complete. Ready to automate video creation...');

  await browser.close();
  res.send('✅ Puppeteer session complete. Check Railway logs for status.');
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer bot running on port ${PORT}`);
});
