const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  console.log("Navigating to login page...");
  await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle2' });

  // Login
  console.log("Logging in...");
  await page.type('input[type="email"]', 'admin@ethara.com');
  await page.type('input[type="password"]', 'password');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
    page.click('button[type="submit"]')
  ]);

  // Wait for skeletons to disappear and data to load
  await new Promise(r => setTimeout(r, 1500));

  console.log("Capturing Dashboard...");
  await page.screenshot({ path: '../dashboard.png' });

  console.log("Navigating to Projects...");
  await page.goto('http://localhost:5173/projects', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  
  console.log("Capturing Projects...");
  await page.screenshot({ path: '../projects.png' });

  console.log("Navigating to Kanban Board...");
  await page.goto('http://localhost:5173/projects/1', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  
  console.log("Capturing Kanban Board...");
  await page.screenshot({ path: '../kanban.png' });

  await browser.close();
  console.log("All screenshots captured successfully.");
})();
