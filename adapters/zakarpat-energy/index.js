const { ZakarpatEnergyAdapter } = require("./super");
const {
  config: { USE_BROWSER_EMULATION, PREFER_BROWSER_EMULATION },
} = require("./../../config");

module.exports.zakarpatEnergyAdapter = new ZakarpatEnergyAdapter({
  useBrowserEmulation: USE_BROWSER_EMULATION,
  preferBrowserEmulation: PREFER_BROWSER_EMULATION,
});
