/**
 * Calculates suspension kits (hanger + rod + anchor) for the ceiling
 * @param {number} area - Total ceiling area in square meters
 * @returns {object} Calculated suspension components
 */
function calculateSuspensionKit(area) {
  const safetyMargin = 1.1; // 10% margin

  // Standard rule: ~1.5 suspension points per m2
  const totalPoints = Math.ceil(area * 1.5 * safetyMargin);

  return {
    suspensionPoints: totalPoints,
    adjustableHangers: totalPoints, // Reguladores
    threadedRods: totalPoints, // Tirantes (Arame/Vareta)
    ceilingAnchors: totalPoints, // Buchas/Chumbadores para laje
    note: "Based on 1.5 points per square meter",
  };
}

// Example: For a 20m2 room
console.log(calculateSuspensionKit(20));
