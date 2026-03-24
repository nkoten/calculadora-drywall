/**
 * Drywall Material Estimator for Ceilings
 * Returns a complete list of materials based on room dimensions
 *
 * @param {Object} options - Objeto de configuração
 * @param {number} options.width - Largura do cômodo em metros
 * @param {number} options.length - Comprimento do cômodo em metros
 * @param {number} options.maodeobra - Valor ou multiplicador da mão de obra
 */
function drywallCeilingCalculator({ width, length, maodeobra }) {
  const area = width * length;
  const perimeter = (width + length) * 2;
  const safetyMargin = 1.05; // 5%
  // Definimos qual é o lado menor para distribuir os perfis F530
  // Em corredores, os perfis cruzam a menor largura para maior estabilidade.
  const menorLado = Math.min(width, length);
  const maiorLado = Math.max(width, length);

  return {
    dimensions: {
      area: area.toFixed(2) + " m²",
      perimeter: perimeter.toFixed(2) + " m",
    },
    boards: {
      drywallSheets: Math.ceil((area / 2.16) * safetyMargin), // 1.20x1.80m sheet
      description: "Placa STD 1.20x1.80",
    },
    framing: {
      // f530Profiles: Math.ceil(((area * 1.8) / 3) * safetyMargin), // 3m bars
      // Consumo de F530: 0.7m por m² de área
      // f530Profiles: Math.ceil(((area * 0.7) / 3) * safetyMargin), // 3m bars
      // f530Profiles: Math.ceil(((area * (width < 2 ? 1.5 : 1.8)) / 3) * safetyMargin,), // 3m bars
      f530Profiles: (() => {
        const espacamento = 0.6;
        const numLinhas = Math.ceil(maiorLado / espacamento) + 1;
        const metrosLineares = numLinhas * menorLado;
        // return Math.ceil(metrosLineares / 3) + 1; // +1 barra de segurança para emendas
        return Math.ceil((metrosLineares / 3) * safetyMargin); // +1 barra de segurança para emendas
      })(),
      // Tabicas: Perímetro / 3m da barra
      perimeterTracks: Math.ceil((perimeter / 3) * safetyMargin), // Tabicas (3m)
      // Reguladores/Tirantes: 1.5 un por m²
      // suspensionKits: Math.ceil(area * 1.5 * safetyMargin), // Hanger + Rod + Anchor
      suspensionKits: Math.ceil(area * 2), // Hanger + Rod + Anchor
    },
    fixings: {
      // drywallScrews: Math.ceil((area / 2.16) * 32 * safetyMargin), // Sheet to metal
      // GN25: 15 a 20 un por m²
      drywallScrews: Math.ceil(area * 25 * safetyMargin), // Sheet to metal
      // framingScrews: Math.ceil(area * 15 * safetyMargin), // Metal to metal (Lentilha)
      // Metal/Metal (Lentilha): 8 un por m² (estava alto com 15)
      framingScrews: Math.ceil(area * 8 * safetyMargin), // Metal to metal (Lentilha)
      // Parafuso/Bucha parede: 1 a cada 60cm no perímetro
      wallPlugsAndScrews: Math.ceil((perimeter / 0.6) * safetyMargin), // - For perimeter tracks
    },
    finishing: {
      // Fita: 1.5m por m²
      jointTapeMeters: Math.ceil(area * 1.5 * safetyMargin), // fita
      // Massa: 0.5kg por m²
      jointCompoundKg: (area * 0.5 * safetyMargin).toFixed(2), // massa
    },
    teste: ((a = 3, b = 5) => a * b)(),
  };
}

/**
 * - placas: drywallSheets
 * - tabica ou cantoneiras: perimeterTracks
 * - perfil canaleta f530: f530Profiles
 * - tirantes: suspensionKits
 * - reguladores: suspensionKits
 * - lfixadores: suspensionKits
 * - lentilhas: framingScrews
 * - gn25: drywallScrews
 * - parfuso e bucha para tabica: wallPlugsAndScrews
 * - fita: jointTapeMeters
 * - massa: jointCompoundKg
 * */

// How to use:
// const myOfficeCeiling = calculateCompleteCeiling({ width: 4, length: 5, maodeobra: 100 });
// console.log(myOfficeCeiling);
