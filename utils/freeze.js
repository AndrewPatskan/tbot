/**
 * Freeze object and his nested components
 * @template T
 * @param {T} obj target object
 * @returns {T} freezedObj (isFrozen=true)
 */
const deepFreeze = (obj) => {
  Object.getOwnPropertyNames(obj).forEach((prop) => {
    // @ts-ignore
    if (typeof obj[prop] === "object" && !Object.isFrozen(obj[prop])) {
      // eslint-disable-next-line no-unused-vars
      // @ts-ignore
      deepFreeze(obj[prop]);
    }
  });

  return Object.freeze(obj);
};

module.exports = { deepFreeze };
