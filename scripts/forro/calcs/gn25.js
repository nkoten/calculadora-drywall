
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
