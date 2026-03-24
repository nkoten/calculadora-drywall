/**
 * Advanced Drywall Wall Calculator with Insulation
 * @param {Object} options - Objeto de configuração
 * @param {number} options.wallLength - Comprimento da parede
 * @param {number} options.wallHeight - Altura da parede
 * @param {Array<{width: number, height: number}>} [options.openings=[]] - Lista de aberturas (portas/janelas)
 * @param {number} [options.studSpacing=0.6] - Espaçamento entre montantes
 */
function calculateWall({
  wallLength,
  wallHeight,
  openings = [],
  studSpacing = 0.6,
}) {
  const safetyMargin = 1.05; // 10%
  const sheetArea = 2.16; // 1.20m x 1.80m
  const barLength = 3.0; // Standard 3m profile

  // 1. Area Calculations
  let totalOpeningArea = 0;

  openings.forEach((op) => {
    totalOpeningArea += op.width * op.height;
  });

  const netAreaOneSide = wallLength * wallHeight - totalOpeningArea;
  const totalBoardArea = netAreaOneSide * 2; // Two faces of the wall

  // 2. Framing Calculation
  const totalRunnersMeters = wallLength * 2 * safetyMargin;
  const runnersCount = Math.ceil(totalRunnersMeters / barLength);

  const mainStudsCount = Math.ceil(wallLength / studSpacing) + 1;
  const extraStudsForOpenings = openings.length * 2;
  const totalStudsCount = Math.ceil(
    (mainStudsCount + extraStudsForOpenings) * safetyMargin,
  );

  // 3. Complete Material List
  return {
    dimensions: {
      netAreaOneSide: netAreaOneSide.toFixed(2) + " m²",
      totalBoardArea: totalBoardArea.toFixed(2) + " m²",
    },
    boards: {
      drywallSheets: Math.ceil((totalBoardArea / sheetArea) * safetyMargin),
    },
    insulation: {
      // Insulation area is equal to one side of the wall (net area)
      insulationM2: Math.ceil(netAreaOneSide * safetyMargin),
      // description: "Mineral wool or Glass wool for thermal/acoustic insulation",
      description: "Lã mineral ou lã de vidro para isolamento térmico/acústico",
    },
    metalFraming: {
      // runners3m: runnersCount,
      // runners3m: Math.ceil(((wallLength * 2) / 3) * safetyMargin),
      runners3m:
        (wallLength * 2) % 3 === 0
          ? (wallLength * 2) / 3
          : Math.ceil(((wallLength * 2) / 3) * safetyMargin),
      // studs3m: totalStudsCount,
      studs3m: (() => {
        // A mesma lógica serve para os MONTANTES se o pé-direito for múltiplo de 3
        const numColunas = Math.ceil(wallLength / 0.6) + 1;
        const metrosTotais = numColunas * wallHeight;
        return metrosTotais % 3 === 0
          ? metrosTotais / 3
          : Math.ceil((metrosTotais / 3) * safetyMargin);
      })(),
    },
    fixings: {
      drywallScrews: Math.ceil(
        (totalBoardArea / sheetArea) * 30 * safetyMargin,
      ),
      framingScrews: Math.ceil(totalStudsCount * 4 * safetyMargin),
      wallAnchorsAndScrews: Math.ceil(((wallLength * 2) / 0.6) * safetyMargin),
    },
    finishing: {
      jointTapeMeters: Math.ceil(totalBoardArea * 1.5 * safetyMargin),
      jointCompoundKg: (totalBoardArea * 0.5 * safetyMargin).toFixed(2),
    },
  };
}

/*
// Example: 10m wall, 2.8m high, with 2 doors
const myWallWithInsulation = calculateWall({
  wallLength: 10,
  wallHeight: 2.8,
  openings: [
    { width: 0.8, height: 2.1 },
    { width: 0.8, height: 2.1 },
  ]
});

// console.log(myWallWithInsulation);

const wl = process.argv[2];
const wh = process.argv[3];
const wo = process.argv[4];

console.log(calculateWall(wl, wh));
*/

/* 
guia: metalFraming.runners3m
montante: metalFraming.studs3m
placa: boards.drywallSheets
parafuso e bucha 6: fixings.wallAnchorsAndScrews
parafuso lentilha: fixings.framingScrews
parafuso gn25: fixings.drywallScrews
fita telada: finishing.jointTapeMeters
massa: finishing.jointCompoundKg
lã: insulation.insulationM2
*/
