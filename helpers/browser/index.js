const puppeteer = require("puppeteer");

/**
 * Create temporary singletone via HOF context
 * @returns {Promise<BrowserInstance | null>}
 */
module.exports.instantiateBrowser = async () => {
  try {
    const browser = await puppeteer.launch({ headless: true });

    return {
      /**
       * Fetch page content, render & execute JS, get resulted HTML
       * @param {string} targetURL
       * @returns {Promise<string>}
       */
      fetchPageContent: async (targetURL) => {
        const page = await browser.newPage();

        page.setViewport({ width: 1366, height: 768 });
        page.setUserAgent(
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        );
        page.setRequestInterception(true);

        page.on("request", (request) => {
          if (!request.isNavigationRequest()) {
            request.continue();

            return;
          }
          const headers = request.headers();
          headers.Accept =
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3";
          headers["Accept-Encoding"] = "gzip";
          headers["Accept-Language"] = "en-US,en;q=0.9,es;q=0.8";
          headers["Upgrade-Insecure-Requests"] = "1";
          headers.Referer = "https://www.google.com/";
          request.continue({ headers });
        });

        await page.setCookie({
          name: "CONSENT",
          value: `YES+cb.${new Date()
            .toISOString()
            .split("T")[0]
            .replace(/-/g, "")}-04-p0.en-GB+FX+667`,
          domain: ".google.com",
        });

        await page.goto(targetURL, { waitUntil: "networkidle2" });

        const content = await page.content();

        await page.close();

        return content;
      },

      destroy: async () => {
        try {
          await browser.close();

          return true;
        } catch (error) {
          console.warn("Puppeteer returns an error on closing:");
          console.error(error);

          return false;
        }
      },
    };
  } catch (error) {
    console.warn(`Can't setup Puppeteer instance:`);
    console.error(error);

    return null;
  }
};

// =============================================================================
// Typedef
// =============================================================================
/**
 * @typedef {{
 *   fetchPageContent: function(string):Promise<string>,
 *   destroy: function():Promise<boolean>
 * }} BrowserInstance
 */
