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
      '--
