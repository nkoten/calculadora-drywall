
/**
 * Montantes a cada 400mm
 * @param {number} comprimento
 */
export function calcMontantes(comprimento) {
  return ceil((comprimento / 0.4) + 1);
}
