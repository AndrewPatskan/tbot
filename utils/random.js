/**
 * Returns random number in range
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
const randomInRange = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

/**
 * Returns random element of Array
 * @template T
 * @param {Array<T>} targetArr - array to get random item from
 * @returns {T} arrayItem
 */
const randomItemFrom = (targetArr) => {
  if (!Array.isArray(targetArr)) {
    throw new TypeError("Argument must be an array!");
  }

  if (!targetArr.length) {
    throw new Error(`Target array can't be empty!`);
  }

  return targetArr[randomInRange(0, targetArr.length - 1)];
};

module.exports = { randomInRange, randomItemFrom };
