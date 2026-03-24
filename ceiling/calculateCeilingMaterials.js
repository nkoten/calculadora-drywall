/**
 * Calculates materials for a drywall ceiling (forro)
 * @param {number} width - Room width in meters
 * @param {number} length - Room length in meters
 */
function calculateCeilingMaterials(width, length) {
  const area = width * length;
  const perimeter = (width + length) * 2;
  const margin = 1.1; // 10% safety margin

  // Standard drywall sheet area (1.20m x 1.80m)
  const sheetArea = 2.16;
  // Standard profile/track length (3.00m)
  const barLength = 3.0;

  const results = {
    totalAreaM2: area.toFixed(2),
    totalPerimeterM: perimeter.toFixed(2),

    // Ceiling sheets (Placas)
    drywallSheets: Math.ceil((area / sheetArea) * margin),

    // F530 Profiles (1.8 linear meters per m2)
    f530Profiles: Math.ceil(((area * 1.8) / barLength) * margin),

    // Perimeter tracks/tabicas
    perimeterTracks: Math.ceil((perimeter / barLength) * margin),

    // Screws (average 30 per sheet)
    screws: Math.ceil((area / sheetArea) * 30),

    // Joint compound (0.5kg per m2)
    jointCompoundKg: (area * 0.5).toFixed(2),

    // Joint tape (1.5 meters per m2)
    jointTapeMeters: Math.ceil(area * 1.5),
  };

  return results;
}

// Example: 4m x 5m room
// console.log(calculateCeilingMaterials(4, 5));
