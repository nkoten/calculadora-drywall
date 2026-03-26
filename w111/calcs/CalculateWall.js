
/**
 * Advanced Drywall Wall Calculator with Insulation
 */
function calculateAdvancedWall(wallLength, wallHeight, openings = [], studSpacing = 0.60) {
    const safetyMargin = 1.10; // 10%
    const sheetArea = 2.16;    // 1.20m x 1.80m
    const barLength = 3.00;    // Standard 3m profile

    // 1. Area Calculations
    let totalOpeningArea = 0;
    
    openings.forEach(op => {
        totalOpeningArea += (op.width * op.height);
    });

    const netAreaOneSide = (wallLength * wallHeight) - totalOpeningArea;
    const totalBoardArea = netAreaOneSide * 2; // Two faces of the wall

    // 2. Framing Calculation
    const totalRunnersMeters = (wallLength * 2) * safetyMargin;
    const runnersCount = Math.ceil(totalRunnersMeters / barLength);

    const mainStudsCount = Math.ceil(wallLength / studSpacing) + 1;
    const extraStudsForOpenings = openings.length * 2; 
    const totalStudsCount = Math.ceil((mainStudsCount + extraStudsForOpenings) * safetyMargin);

    // 3. Complete Material List
    return {
        dimensions: {
            netAreaOneSide: netAreaOneSide.toFixed(2) + " m²",
            totalBoardArea: totalBoardArea.toFixed(2) + " m²"
        },
        boards: {
            drywallSheets: Math.ceil((totalBoardArea / sheetArea) * safetyMargin)
        },
        insulation: {
            // Insulation area is equal to one side of the wall (net area)
            insulationM2: Math.ceil(netAreaOneSide * safetyMargin),
            description: "Mineral wool or Glass wool for thermal/acoustic insulation"
        },
        metalFraming: {
            runners3m: runnersCount, 
            studs3m: totalStudsCount
        },
        fixings: {
            drywallScrews: Math.ceil((totalBoardArea / sheetArea) * 30 * safetyMargin),
            framingScrews: Math.ceil((totalStudsCount * 4) * safetyMargin), 
            wallAnchorsAndScrews: Math.ceil(((wallLength * 2) / 0.60) * safetyMargin)
        },
        finishing: {
            jointTapeMeters: Math.ceil(totalBoardArea * 1.5 * safetyMargin),
            jointCompoundKg: (totalBoardArea * 0.5 * safetyMargin).toFixed(2)
        }
    };
}

// Example: 10m wall, 2.8m high, with 2 doors
const myWallWithInsulation = calculateAdvancedWall(10, 2.8, [
    { width: 0.8, height: 2.1 },
    { width: 0.8, height: 2.1 }
]);

// console.log(myWallWithInsulation);

const wl = process.argv[2];
const wh = process.argv[3];
const wo = process.argv[4];

console.log( calculateAdvancedWall( wl, wh ) );

