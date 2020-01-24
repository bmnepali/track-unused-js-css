const puppeteer = require('puppeteer');
const util = require('util');

// URL to test for the css code-coverage
const url = "https://example.com/";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.coverage.startCSSCoverage();
  await page.goto(url);
  const css_coverage = await page.coverage.stopCSSCoverage();
  console.log(util.inspect(css_coverage, { showHidden: false, depth: null }));
  await browser.close();

  // Preparing the create only the used css in the project
  let final_css_bytes = '';
  let total_bytes = 0;
  let used_bytes = 0;

  for (const entry of css_coverage) {
    total_bytes += entry.text.length;
    for (const range of entry.ranges) {
      used_bytes += range.end - range.start - 1;
      final_css_bytes += entry.text.slice(range.start, range.end) + '\n';
    }
  }

  fs.writeFile('./final_css.css', final_css_bytes, error => {
    if (error) {
      console.log('Error creating file:', error);
    } else {
      console.log('File saved');
    }
  });
})();