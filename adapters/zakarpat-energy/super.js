const { fetch } = require("undici");
const crypto = require("crypto");
const { parse: htmlParser } = require("node-html-parser");

const { instantiateBrowser } = require("./../../helpers/browser");
const {
  generateFakeFingerprint,
} = require("./../../helpers/browser/fake-user-agents");

const {
  config: { ZAKOE_URL },
} = require("../../config");

class ZakarpatEnergySchedule {
  #useBrowserEmulation = false;
  #preferBrowserEmulation = false;

  /** @type {(null | import('./../../helpers/browser').BrowserInstance)} */
  #browserInstance = null;

  #hasher = (data) => crypto.createHash("sha1").update(data).digest("hex");

  #targetURL = `${ZAKOE_URL}/customers/break-in-electricity-supply/schedule/`;

  /**
   * @param {object} adapterConfiguration
   * @param {boolean} [adapterConfiguration.useBrowserEmulation]
   * @param {boolean} [adapterConfiguration.preferBrowserEmulation]
   */
  constructor({ useBrowserEmulation = false, preferBrowserEmulation = false }) {
    this.#useBrowserEmulation = useBrowserEmulation || preferBrowserEmulation;
    this.#preferBrowserEmulation = preferBrowserEmulation;
  }

  /**
   * Fetch page via browser
   * @param {string} link
   * @returns {Promise<string|null>} html content
   */
  async #handleViaBrowser(link) {
    if (!this.#useBrowserEmulation) {
      console.warn(
        `Browser emulation is disabled, handling of "${link}" will be skipped...`
      );

      return null;
    }

    if (!this.#browserInstance) {
      this.#browserInstance = await instantiateBrowser();

      if (this.#browserInstance === null) {
        throw new Error(`Can't get browser instance.`);
      }
    }

    return this.#browserInstance.fetchPageContent(link);
  }

  /**
   * Extract page content html
   * @param {string} pageLink
   */
  async #extractPageContent(pageLink) {
    const { specificHeaders, userAgent } = generateFakeFingerprint(
      { referer: pageLink },
      { preferredBrowser: "CHROME" }
    );

    /**
     * Undici has some issue with binding of dispatcher response typing, so we use explicit definition instead
     * @type {import('undici').Response}
     */
    // @ts-ignore
    const pageResponse = await fetch(this.#targetURL, {
      method: "GET",
      // @ts-ignore
      headers: {
        "user-agent": userAgent,
        ...specificHeaders,
      },
    });

    const protectedByCloudflare = [403, 1020].includes(pageResponse.status);

    if (protectedByCloudflare)
      console.warn(
        "Found page protected with Cloudflare, switching to browser fallback..."
      );

    console.dir({
      status: pageResponse.status,
      pageURL: pageResponse.url,
    });

    let _content =
      protectedByCloudflare || this.#preferBrowserEmulation
        ? await this.#handleViaBrowser(this.#targetURL)
        : await pageResponse.text();

    if (!_content)
      throw new Error(`Content fetch failed for: ${pageResponse.url}`);

    const $pageContent = htmlParser(_content);

    // clear expensive content variable
    _content = null;

    return {
      originalContentURL: pageResponse.url,
      $pageContent,
    };
  }

  /**
   * Extract pdf file links
   * @param {import('node-html-parser').HTMLElement} $pageContent
   */
  async #extractPDFLinks($pageContent) {
    const content = $pageContent
      .querySelectorAll(
        'a[href^="/customers/break-in-electricity-supply/schedule"].title'
      )
      ?.map((node) => `${ZAKOE_URL}${node.getAttribute("href")}`);

    return {
      content,
      sha1: content ? this.#hasher(content.join()) : null,
    };
  }

  /**
   * Extract schedule image src link
   * @param {import('node-html-parser').HTMLElement} $pageContent
   */
  async #extractScheduleImageLink($pageContent) {
    const srcLink = $pageContent
      .querySelector('img[src^="/upload/current-timetable/"]')
      ?.getAttribute("src");

    return {
      link: srcLink,
      sha1: srcLink ? this.#hasher(srcLink) : null,
    };
  }
  /**
   * Extract action log entries
   * @param {import('node-html-parser').HTMLElement} $pageContent
   */
  async #extractActionLogEntries($pageContent) {
    const content = $pageContent
      .querySelectorAll('div.textLayer div[style^="left"]')
      .reduce((acc, curr, idx, arr) => {
        const textContent = curr.innerText;

        // exclude unicode list mark
        if (textContent === "") {
          acc.push("\n");
          return acc;
        }

        // fix grammar issue on fragments concat
        acc.push(
          idx > 0 &&
            !/(\.|\s|[А-Я])$/.test(arr[idx - 1].innerText) &&
            // ^ Previous element: completed sentence, already exist whitespace or abbreviation part are skipped
            !/^(\s|\.)/.test(textContent)
            ? // ^ Current element: starts with dot(completed sentence char) or whitespace
              ` ${textContent}`
            : // ^ Append element with required whitespace
              textContent
          // ^ Skip excessive processing
        );

        return acc;
      }, [])
      .join("") // cast to string for fragments concat (fix excessive word wrap formatting)
      .split("\n") // split by lines
      .slice(1) // skip title
      .map((i) =>
        (!i.endsWith(".") ? `${i}.` : i.replace(" .", ".")).replace(/^\s/, "")
      );
    // ^ fix missed or white-spaced dots, and whitespace at thr beginning after concat

    return {
      content,
      sha1: content ? this.#hasher(content.join()) : null,
    };
  }

  async fetchSchedulePageEntities() {
    const { $pageContent } = await this.#extractPageContent(
      "/customers/break-in-electricity-supply/schedule/"
    );

    const [pdfLinks, scheduleImage, actionLogEntries] = await Promise.all([
      this.#extractPDFLinks($pageContent),
      this.#extractScheduleImageLink($pageContent),
      this.#extractActionLogEntries($pageContent),
    ]);

    if (await this.#browserInstance.destroy())
      console.log("Browser instance was destroyed.");

    return {
      pdfLinks,
      scheduleImage,
      actionLogEntries,
    };
  }
}

module.exports = { ZakarpatEnergyAdapter: ZakarpatEnergySchedule };
