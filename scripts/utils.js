
/**
 * Arredonda sempre para cima (obra real)
 * @param {number} value
 * @returns {number}
 */
export function ceil(value) {
  return Math.ceil(value);
}

/**
 * Aplica margem de perda
 * @param {number} value
 * @param {number} margem (0 a 1)
 */
export function aplicarMargem(value, margem = 0) {
  return value * (1 + margem);
}

