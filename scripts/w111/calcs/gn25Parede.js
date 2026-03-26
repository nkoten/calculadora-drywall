
/**
 * Parafusos GN25 (placa)
 * @param {number} area
 * @param {number} margem
 */
export function calcParafusoGN25Parede(area, margem = 0) {
  const consumo = area * 30; // 30 un/m² dupla face
  return ceil(aplicarMargem(consumo, margem));
}
