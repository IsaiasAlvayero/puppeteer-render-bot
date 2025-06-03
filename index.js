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
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const page = await browser.newPage();

  try {
    const cookies = JSON.parse(await fs.readFile(COOKIE_PATH));
    await page.setCookie(...cookies);
    console.log('✅ Cookies loaded.');
  } catch (err) {
    console.log('⚠️ No cookies found. Starting fresh login...');
  }

  await page.goto('https://example.com');
  await browser.close();

  res.send('✅ Puppeteer bot completed!');
});

app.listen(PORT, () => {
  console.log(`🚀 Puppeteer bot running on port ${PORT}`);
});
