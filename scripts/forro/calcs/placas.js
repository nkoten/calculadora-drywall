
/**
 * Placas para forro
 * @param {number} area
 * @param {number} areaPlaca
 * @param {number} margem
 */
export function calcPlacasForro(area, areaPlaca, margem = 0) {
  return ceil(aplicarMargem((area * 1.05) / areaPlaca, margem));
}
