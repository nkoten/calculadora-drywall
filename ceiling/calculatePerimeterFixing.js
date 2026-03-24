/**
 * Calculates wall plugs (anchors) and screws for perimeter tracks (tabicas)
 * @param {number} perimeter - Total perimeter of the room in meters
 * @param {number} spacing - Spacing between fixings (default 0.60m)
 * @returns {object} Calculated anchors and screws
 */
function calculatePerimeterFixing(perimeter, spacing = 0.6) {
  const safetyMargin = 1.1; // 10% extra for corners and losses

  // Total points along the walls
  const totalFixings = Math.ceil((perimeter / spacing) * safetyMargin);

  return {
    wallPlugs: totalFixings, // Buchas (S6 or S8)
    perimeterScrews: totalFixings, // Parafusos para alvenaria
    note: "Estimated for perimeter tracks only (tabicas/cantoneiras)",
  };
}

// Example: For a room with 18m perimeter
// console.log(calculatePerimeterFixing(18));
