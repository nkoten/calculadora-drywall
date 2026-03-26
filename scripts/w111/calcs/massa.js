
/**
 * Massa para tratamento
 * @param {number} area
 * @param {number} margem
 */
export function calcMassa(area, margem = 0) {
  return aplicarMargem(area * 1.3, margem);
}
