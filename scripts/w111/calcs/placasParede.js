
/**
 * Placas para parede W111 (2 lados)
 * @param {number} area
 * @param {number} areaPlaca (ex: 2.88 ou 2.16)
 * @param {number} margem
 */
export function calcPlacasParede(area, areaPlaca, margem = 0) {
  const consumo = area * 2; // dupla face
  return ceil(aplicarMargem(consumo / areaPlaca, margem));
}
