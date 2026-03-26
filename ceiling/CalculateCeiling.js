/**
 * Drywall Material Estimator for Ceilings
 * Returns a complete list of materials based on room dimensions
 */
function calculateCeiling(width, length) {
  const area = width * length;
  const perimeter = (width + length) * 2;
  const safetyMargin = 1.0; // 10%

  const data = {
    dimensions: {
      area: area.toFixed( 2 ),
      perimeter: perimeter.toFixed( 2 ),
    },
    boards: { drywallSheets: ceil( ( area / 2.16 ) * safetyMargin )},
    framing: {
      f530Profiles: ceil(((area * 1.8) / 3) * safetyMargin), 
      perimeterTracks: ceil((perimeter / 3) * safetyMargin), 
      suspensionKits: ceil(area * 1.5 * safetyMargin), 
    },
    fixings: {
      drywallScrews: ceil((area / 2.16) * 32 * safetyMargin), 
      framingScrews: ceil(area * 15 * safetyMargin), 
      wallAnchorsAndScrews: ceil((perimeter / 0.6) * safetyMargin), 
    },
    finishing: {
      jointTapeMeters: ceil(area * 1.5 * safetyMargin),
      jointCompoundKg: (area * 0.5 * safetyMargin).toFixed(2),
    },
  };
  const descriptions = {
    dimensions: {
      area: area.toFixed(2) + " m²",
      perimeter: perimeter.toFixed(2) + " m",
    },
    boards: {
      drywallSheets: Math.ceil((area / 2.16) * safetyMargin), // 1.20x1.80m sheet
      // description: "Standard 12.5mm Drywall Sheets",
      description: "Placa STD 1.20x1.80",
    },
    framing: {
      f530Profiles: Math.ceil(((area * 1.8) / 3) * safetyMargin), // 3m bars
      perimeterTracks: Math.ceil((perimeter / 3) * safetyMargin), // Tabicas (3m)
      suspensionKits: Math.ceil(area * 1.5 * safetyMargin), // Hanger + Rod + Anchor
    },
    fixings: {
      drywallScrews: Math.ceil((area / 2.16) * 32 * safetyMargin), // Sheet to metal
      framingScrews: Math.ceil(area * 15 * safetyMargin), // Metal to metal (Lentilha)
      wallAnchorsAndScrews: Math.ceil((perimeter / 0.6) * safetyMargin), // For perimeter tracks
    },
    finishing: {
      jointTapeMeters: Math.ceil(area * 1.5 * safetyMargin),
      jointCompoundKg: (area * 0.5 * safetyMargin).toFixed(2),
    },
  };

  return {
    service: data,
    serviceDescription: descriptions,
  };
}

/**
  * --- utils --- 
  *  */
function ceil( input ) {
  return Math.ceil( input);
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
 * - parfuso e bucha para tabica
 * - fita: jointTapeMeters
 * - massa: jointCompoundKg
 * */

// How to use:
// const myOfficeCeiling = calculateCompleteCeiling(4, 5);
// console.log(myOfficeCeiling);
