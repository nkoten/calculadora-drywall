
/**
 * Fita telada
 * @param {number} area
 * @param {number} margem
 */
export function calcFita(area, margem = 0) {
  return ceil(aplicarMargem(area * 3.2, margem));
}
