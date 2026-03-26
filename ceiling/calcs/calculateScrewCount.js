
/**
 * Calculates the required number of drywall screws for a ceiling
 * @param {number} area - Total ceiling area in square meters
 * @returns {number} Estimated total screws with a safety margin
 */
function calculateScrewCount(area) {
    // 2.16 is the standard sheet area (1.20m x 1.80m)
    const sheets = area / 2.16;
    const screwsPerSheet = 32; // Recommended average for ceilings
    const safetyMargin = 1.10; // 10% extra for drops/losses
    
    return Math.ceil(sheets * screwsPerSheet * safetyMargin);
}

// Usage for a 20m2 room
const totalScrews = calculateScrewCount(20);
console.log(`Total screws needed: ${totalScrews}`);

