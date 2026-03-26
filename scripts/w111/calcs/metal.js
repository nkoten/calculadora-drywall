
/**
 * Parafuso metal-metal
 * @param {number} montantes
 * @param {number} guias
 */
export function calcParafusoMetal(montantes, guias) {
  return ceil((montantes + guias) * 4);
}
