
/**
  * --- calc w111
  *  */




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

/**
 * Guia superior + inferior
 * @param {number} comprimento
 */
export function calcGuias(comprimento) {
  return ceil((comprimento * 2) / 3);
}

/**
 * Montantes a cada 400mm
 * @param {number} comprimento
 */
export function calcMontantes(comprimento) {
  return ceil((comprimento / 0.4) + 1);
}

/**
 * Lã de vidro (opcional)
 * @param {number} area
 */
export function calcLa(area) {
  return area;
}

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

/**
 * Fita telada
 * @param {number} area
 * @param {number} margem
 */
export function calcFita(area, margem = 0) {
  return ceil(aplicarMargem(area * 3.2, margem));
}

/**
 * Massa para tratamento
 * @param {number} area
 * @param {number} margem
 */
export function calcMassa(area, margem = 0) {
  return aplicarMargem(area * 1.3, margem);
}

/**
 * Parafuso metal-metal
 * @param {number} montantes
 * @param {number} guias
 */
export function calcParafusoMetal(montantes, guias) {
  return ceil((montantes + guias) * 4);
}

/**
 * Parafusos GN25 (placa)
 * @param {number} area
 * @param {number} margem
 */
export function calcParafusoGN25Parede(area, margem = 0) {
  const consumo = area * 30; // 30 un/m² dupla face
  return ceil(aplicarMargem(consumo, margem));
}
