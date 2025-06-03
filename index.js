const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;
const COOKIE_PATH = path.join(__dirname, 'cookies.json');

app.get('/', async (req, res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  // Try to load saved cookies
  try {
    const cookies = JSON.parse(await fs.readFile(COOKIE_PATH));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded.');
  } catch (err) {
    console.log('⚠️ No cookies found. Starting fresh login.');
  }

  // Go to InVideo
  await page.goto('https://ai.invideo.io', { waitUntil: 'networkidle2' });

  // Check if already logged in
  const currentURL = page.url();
  if (currentURL.includes('dashboard')) {
    console.log('✅ Already logged in, continuing...');
  } else {
    console.log('🛑 Manual login required. Waiting 30 seconds...');
    await page.waitForTimeout(30000); // You manually log in via Google in this time

    // Save cookies after login
    const cookies = await page.cookies();
    await fs.writeFile(COOKIE_PATH, JSON.stringify(cookies, null, 2));
    console.log('✅ Cookies saved for future use.');
  }

  // Placeholder for automation step
  console.log('🚧 Logged in. Ready for automation steps (not yet implemented).');

  await browser.close();
  res.send('✅ Puppeteer ran. Login status handled. Check Railway logs.');
});

app.listen(PORT, () => {
  console.log(`Puppeteer bot running on port ${PORT}`);
});
