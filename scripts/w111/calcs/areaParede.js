
/**
 * Calcula área útil da parede descontando vãos
 * @param {number} altura
 * @param {number} comprimento
 * @param {number[]} vaosAreas
 */
export function calcAreaParede(altura, comprimento, vaosAreas = []) {
  const areaBruta = altura * comprimento;
  const areaVaos = vaosAreas.reduce((a, b) => a + b, 0);
  return areaBruta - areaVaos;
}
