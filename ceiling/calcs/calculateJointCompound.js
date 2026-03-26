/**
 * Calculates the amount of joint compound (massa) needed
 * @param {number} area - Total area in square meters
 * @param {number} containerSize - Size of the bucket/box in kg (default 30kg)
 * @param {boolean} fullSurface - If true, calculates for skim coating (1.0kg/m2)
 */
function calculateJointCompound(area, containerSize = 30, fullSurface = false) {
  // 0.5kg for joints only, 1.0kg for full surface finishing
  const consumptionPerM2 = fullSurface ? 1.0 : 0.5;
  const safetyMargin = 1.1; // 10% for waste and sanding loss

  const totalKgNeeded = (area * consumptionPerM2 * safetyMargin).toFixed(2);
  const containersNeeded = Math.ceil(totalKgNeeded / containerSize);

  return {
    totalKg: parseFloat(totalKgNeeded),
    containersNeeded: containersNeeded,
    containerSizeKg: containerSize,
    finishingType: fullSurface
      ? "Full Surface (Skim Coat)"
      : "Joints & Screws Only",
  };
}

// Example: 20m2 room using 30kg buckets
// console.log(calculateJointCompound(20, 30));
