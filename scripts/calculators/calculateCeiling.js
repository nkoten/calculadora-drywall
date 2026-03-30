import { ceil } from "./utils/utils.js";
/**
 * Drywall Material Estimator for Ceilings
 * Returns a complete list of materials based on room dimensions
 *
 * @param {Object} options - Objeto de configuração
 * @param {number} options.width - Largura do cômodo em metros
 * @param {number} options.length - Comprimento do cômodo em metros
 * @param {number} options.labor - Valor ou multiplicador da mão de obra
 * @param {number} options.safety - Margem de segurança para quebras oj perdas
 */
export default function calculateCeiling({ width, length, labor, safety }) {
  const area = width * length;
  const perimeter = (width + length) * 2;
  const safetyMargin = safety || 1.0; // para 0% ou 1.05 para 5%
  // Definimos qual é o lado menor para distribuir os perfis F530
  // Em corredores, os perfis cruzam a menor largura para maior estabilidade.
  const menorLado = Math.min(width, length);
  const maiorLado = Math.max(width, length);

  const data = {
    dimensions: {
      area: area.toFixed(2),
      perimeter: perimeter.toFixed(2),
    },
    boards: {
      // 1.20x1.80m sheet
      drywallSheets: ceil((area / 2.16) * safetyMargin),
    },
    framing: {
      f530Profiles: (() => {
        const espacamento = 0.6;
        const numLinhas = ceil(maiorLado / espacamento) + 1;
        const metrosLineares = numLinhas * menorLado;
        // +1 barra de segurança para emendas
        return ceil((metrosLineares / 3) * safetyMargin);
      })(),
      // Tabicas (3m)
      perimeterTracks: ceil((perimeter / 3) * safetyMargin),
      // Anchor + Rod + Hanger
      suspensionKits: ceil(area * 2),
    },
    fixings: {
      // Sheet to metal
      drywallScrews: ceil(area * 25 * safetyMargin),
      // Metal to metal (Lentilha)
      framingScrews: ceil(area * 8 * safetyMargin),
      // 1 a cada 60cm no perímetro - For perimeter tracks
      wallPlugsAndScrews: ceil((perimeter / 0.6) * safetyMargin),
    },
    finishing: {
      // Fita: 1.5m por m²
      jointTapeMeters: ceil(area * 1.5 * safetyMargin), // fita
      // Massa: 0.5kg por m²
      jointCompoundKg: (area * 0.5 * safetyMargin).toFixed(2), // massa
    },
    teste: ((a = 3, b = 5) => a * b)(),
  };
  /* --- end data --- */

  const serviceDescriptions = {
    dimensions: {
      area: area.toFixed(2) + " m²",
      perimeter: perimeter.toFixed(2) + " m",
    },
    boards: {
      drywallSheets: ceil((area / 2.16) * safetyMargin), // 1.20x1.80m sheet
      description: "Placa STD 1.20x1.80",
    },
    framing: {
      // f530Profiles: ceil(((area * 1.8) / 3) * safetyMargin), // 3m bars
      // Consumo de F530: 0.7m por m² de área
      // f530Profiles: ceil(((area * 0.7) / 3) * safetyMargin), // 3m bars
      // f530Profiles: ceil(((area * (width < 2 ? 1.5 : 1.8)) / 3) * safetyMargin,), // 3m bars
      f530Profiles: (() => {
        const espacamento = 0.6;
        const numLinhas = ceil(maiorLado / espacamento) + 1;
        const metrosLineares = numLinhas * menorLado;
        // return ceil(metrosLineares / 3) + 1; // +1 barra de segurança para emendas
        return ceil((metrosLineares / 3) * safetyMargin); // +1 barra de segurança para emendas
      })(),
      // Tabicas: Perímetro / 3m da barra
      perimeterTracks: ceil((perimeter / 3) * safetyMargin), // Tabicas (3m)
      // Reguladores/Tirantes: 1.5 un por m²
      // suspensionKits: ceil(area * 1.5 * safetyMargin), // Hanger + Rod + Anchor
      suspensionKits: ceil(area * 2), // Hanger + Rod + Anchor
    },
    fixings: {
      // drywallScrews: ceil((area / 2.16) * 32 * safetyMargin), // Sheet to metal
      // GN25: 15 a 20 un por m²
      drywallScrews: ceil(area * 25 * safetyMargin), // Sheet to metal
      // framingScrews: ceil(area * 15 * safetyMargin), // Metal to metal (Lentilha)
      // Metal/Metal (Lentilha): 8 un por m² (estava alto com 15)
      framingScrews: ceil(area * 8 * safetyMargin), // Metal to metal (Lentilha)
      // Parafuso/Bucha parede: 1 a cada 60cm no perímetro
      wallPlugsAndScrews: ceil((perimeter / 0.6) * safetyMargin), // - For perimeter tracks
    },
    finishing: {
      // Fita: 1.5m por m²
      jointTapeMeters: ceil(area * 1.5 * safetyMargin), // fita
      // Massa: 0.5kg por m²
      jointCompoundKg: (area * 0.5 * safetyMargin).toFixed(2), // massa
    },
    teste: ((a = 3, b = 5) => a * b)(),
  };

  return { data, serviceDescriptions };
}

/**
 * - area
 * - perimetro
 * - tabica / cantoneiras       : perimeterTracks
 * - parfuso e bucha para tabica: wallPlugsAndScrews
 * - perfil canaleta f530       : f530Profiles
 * - lentilhas                  : framingScrews
 * - lfixadores                 : suspensionKits
 * - tirantes                   : suspensionKits
 * - reguladores                : suspensionKits
 * - placas                     : drywallSheets
 * - gn25                       : drywallScrews
 * - fita                       : jointTapeMeters
 * - massa                      : jointCompoundKg
 * */

// How to use:
const myOfficeCeiling = calculateCeiling({
  width: 4,
  length: 5,
  labor: 100,
});
console.log("calculateCeiling", myOfficeCeiling);
