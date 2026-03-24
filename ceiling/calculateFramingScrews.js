
/**
 * Calculates framing screws (metal-to-metal) for ceiling structure
 * @param {number} area - Total ceiling area in square meters
 * @param {number} perimeter - Total perimeter in meters
 */
function calculateFramingScrews(area, perimeter) {
    const safetyMargin = 1.15; // 15% margin for metal screws (high loss rate)
    
    // Average rule: 15 screws per square meter for a standard grid
    const estimatedScrews = Math.ceil((area * 15) * safetyMargin);
    
    return {
        framingScrewsTotal: estimatedScrews,
        boxQuantity: Math.ceil(estimatedScrews / 100) * 100 // Rounded to nearest hundred (common box size)
    };
}

// Example for 20m2
console.log(calculateFramingScrews(20, 18));

