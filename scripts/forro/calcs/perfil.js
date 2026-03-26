
/**
 * Perfis F530 a cada 400mm
 * @param {number} largura
 * @param {number} comprimento
 */
export function calcF530(largura, comprimento) {
  const linhas = largura / 0.4;
  return ceil(linhas * (comprimento / 3));
}
