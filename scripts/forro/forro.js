
/**
  * --- caclulate ceiling
  *  */


/**
 * Área do forro
 */
export function calcAreaForro(largura, comprimento) {
  return largura * comprimento;
}

/**
 * Perímetro
 */
export function calcPerimetro(l, c) {
  return (l + c) * 2;
}

/**
 * Placas para forro
 * @param {number} area
 * @param {number} areaPlaca
 * @param {number} margem
 */
export function calcPlacasForro(area, areaPlaca, margem = 0) {
  return ceil(aplicarMargem((area * 1.05) / areaPlaca, margem));
}


/**
 * Tabica metálica
 * @param {number} perimetro
 */
export function calcTabica(perimetro) {
  return ceil(perimetro / 3);
}


/**
 * Perfis F530 a cada 400mm
 * @param {number} largura
 * @param {number} comprimento
 */
export function calcF530(largura, comprimento) {
  const linhas = largura / 0.4;
  return ceil(linhas * (comprimento / 3));
}


/**
 * Arame galvanizado
 * @param {number} area
 */
export function calcArame(area) {
  return ceil(area * 1.2);
}


/**
 * Regulador F530
 * @param {number} area
 */
export function calcRegulador(area) {
  return ceil(area * 0.8);
}


/**
 * Parafuso GN25 forro
 */
export function calcParafusoGN25Forro(area) {
  return ceil(area * 15);
}

/**
 * Parafuso tabica
 */
export function calcParafusoTabica(perimetro) {
  return ceil(perimetro * 3);
}


