// Gedeelde helpers voor de controle-scripts in deze map.
// Vereist Google Chrome (of Chromium). Pad aanpassen via CHROME_PATH.
import { mkdirSync } from "node:fs";
import puppeteer from "puppeteer-core";

const DEFAULT_CHROME = {
  win32: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  linux: "/usr/bin/google-chrome",
};

export const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
export const OUT_DIR = "_notes/shots";
mkdirSync(OUT_DIR, { recursive: true });

export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function launch() {
  return puppeteer.launch({
    executablePath: process.env.CHROME_PATH || DEFAULT_CHROME[process.platform],
    headless: "new",
    // WebGL via software-rendering, zodat de hero-mist ook headless werkt
    args: ["--enable-webgl", "--ignore-gpu-blocklist", "--use-angle=swiftshader"],
  });
}

// Verzamelt JS-fouten en console-errors van een pagina
export function collectErrors(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}
