import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generates a thumbnail for an HTML file using Puppeteer.
 * 
 * @param {string} htmlFile - The path to the HTML file.
 * @param {string} outputFile - The path to the output thumbnail file.
 */
async function generateThumbnailForHtmlFile(htmlFilePath, thumbnailPath) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`file://${htmlFilePath}`);

    // Get the document size
    const documentSize = await page.evaluate(() => {
      return {
        height: document.body.scrollHeight,
      };
    });

    // Set the viewport to fit the document size with high resolution
    await page.setViewport({ width: 1024, height: documentSize.height });

    // Generate thumbnail in PNG format
    await page.screenshot({
      path: thumbnailPath,
      type: 'png', // Generate PNG image
      fullPage: true,
       // Capture the full page
     
    });
    await browser.close();
  } catch (err) {
    console.error(`Error generating thumbnail: ${err}`);
  }
}

export  { generateThumbnailForHtmlFile };