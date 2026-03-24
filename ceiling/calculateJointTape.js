/**
 * Calculates the amount of joint tape needed for finishing
 * @param {number} area - Total area in square meters
 * @param {number} rollSize - Standard roll size (default 45m)
 */
function calculateJointTape(area, rollSize = 45) {
  const consumptionPerM2 = 1.5; // 1.5 meters of tape per m2
  const safetyMargin = 1.1; // 10% for overlaps and waste

  const totalMetersNeeded = Math.ceil(area * consumptionPerM2 * safetyMargin);
  const rollsNeeded = Math.ceil(totalMetersNeeded / rollSize);

  return {
    totalMeters: totalMetersNeeded,
    totalRolls: rollsNeeded,
    tapeType: "Paper Joint Tape",
    standardRollSize: `${rollSize}m`,
  };
}

// Example: 20m2 room with 45m rolls
// console.log(calculateJointTape(20, 45));
