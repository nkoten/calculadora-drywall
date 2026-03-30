import { ceil } from "./utils/utils.js";
/**
 * Advanced Drywall Wall Calculator with Insulation
 * @param {Object} options - Objeto de configuração
 * @param {number} options.wallWidth - Comprimento da parede
 * @param {number} options.wallHeight - Altura da parede
 * @param {Array<{width: number, height: number}>} [options.openings=[]] - Lista de aberturas (portas/janelas)
 * @param {number} [options.studSpacing=0.6] - Espaçamento entre montantes
 * @param {number} options.safety - Margem de perdas e quebras
 */
export default function calculateWall({
  wallWidth,
  wallHeight,
  openings = [],
  safety,
  studSpacing = 0.6,
  labor,
}) {
  // const safetyMargin = 1.05; // 10%
  const safetyMargin = safety || 1.0; // 10%
  const sheetArea = 2.16; // 1.20m x 1.80m
  const barLength = 3.0; // Standard 3m profile

  // Area Calculations
  let totalOpeningArea = 0;

  openings.forEach((op) => {
    totalOpeningArea += op.width * op.height;
  });

  const netAreaOneSide = wallWidth * wallHeight - totalOpeningArea;
  const totalBoardArea = netAreaOneSide * 2; // Two faces of the wall

  // Framing Calculation
  const totalRunnersMeters = wallWidth * 2 * safetyMargin;
  const runnersCount = ceil(totalRunnersMeters / barLength);

  const mainStudsCount = ceil(wallWidth / studSpacing) + 1;
  const extraStudsForOpenings = openings.length * 2;
  const totalStudsCount = ceil(
    (mainStudsCount + extraStudsForOpenings) * safetyMargin,
  );

  const data = {
    dimensions: {
      netAreaOneSide: netAreaOneSide.toFixed(2),
      totalBoardArea: totalBoardArea.toFixed(2),
    },
    boards: {
      drywallSheets: ceil((totalBoardArea / sheetArea) * safetyMargin),
    },
    insulation: {
      insulationM2: ceil(netAreaOneSide * safetyMargin),
    },
    framing: {
      runners3m:
        (wallWidth * 2) % 3 === 0
          ? (wallWidth * 2) / 3
          : ceil(((wallWidth * 2) / 3) * safetyMargin),
      studs3m: (() => {
        const numColunas = ceil(wallWidth / 0.6) + 1;
        const metrosTotais = numColunas * wallHeight;
        return metrosTotais % 3 === 0
          ? metrosTotais / 3
          : ceil((metrosTotais / 3) * safetyMargin);
      })(),
    },
    fixings: {
      drywallScrews: ceil((totalBoardArea / sheetArea) * 30 * safetyMargin),
      framingScrews: ceil(totalStudsCount * 4 * safetyMargin),
      wallPlugsAndScrews: ceil(((wallWidth * 2) / 0.6) * safetyMargin),
    },
    finishing: {
      jointTapeMeters: ceil(totalBoardArea * 1.5 * safetyMargin),
      jointCompoundKg: (totalBoardArea * 0.5 * safetyMargin).toFixed(2),
    },
  };

  // Complete Material List
  const serviceDescriptions = {
    dimensions: {
      netAreaOneSide: netAreaOneSide.toFixed(2) + " m²",
      totalBoardArea: totalBoardArea.toFixed(2) + " m²",
    },
    boards: {
      drywallSheets: ceil((totalBoardArea / sheetArea) * safetyMargin),
    },
    insulation: {
      // Insulation area is equal to one side of the wall (net area)
      insulationM2: ceil(netAreaOneSide * safetyMargin),
      // description: "Mineral wool or Glass wool for thermal/acoustic insulation",
      description: "Lã mineral ou lã de vidro para isolamento térmico/acústico",
    },
    framing: {
      // runners3m: runnersCount,
      // runners3m: ceil(((wallWidth * 2) / 3) * safetyMargin),
      runners3m:
        (wallWidth * 2) % 3 === 0
          ? (wallWidth * 2) / 3
          : ceil(((wallWidth * 2) / 3) * safetyMargin),
      // studs3m: totalStudsCount,
      studs3m: (() => {
        // A mesma lógica serve para os MONTANTES se o pé-direito for múltiplo de 3
        const numColunas = ceil(wallWidth / 0.6) + 1;
        const metrosTotais = numColunas * wallHeight;
        return metrosTotais % 3 === 0
          ? metrosTotais / 3
          : ceil((metrosTotais / 3) * safetyMargin);
      })(),
    },
    fixings: {
      drywallScrews: ceil((totalBoardArea / sheetArea) * 30 * safetyMargin),
      framingScrews: ceil(totalStudsCount * 4 * safetyMargin),
      wallPlugsAndScrews: ceil(((wallWidth * 2) / 0.6) * safetyMargin),
    },
    finishing: {
      jointTapeMeters: ceil(totalBoardArea * 1.5 * safetyMargin),
      jointCompoundKg: (totalBoardArea * 0.5 * safetyMargin).toFixed(2),
    },
  };

  return { data, serviceDescriptions };
}

/*
// Example: 10m wall, 2.8m high, with 2 doors
const myWallWithInsulation = calculateWall({
  wallWidth: 10,
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
guia: framing.runners3m
montante: framing.studs3m
placa: boards.drywallSheets
parafuso e bucha 6: fixings.wallPlugsAndScrews
parafuso lentilha: fixings.framingScrews
parafuso gn25: fixings.drywallScrews
fita telada: finishing.jointTapeMeters
massa: finishing.jointCompoundKg
lã: insulation.insulationM2
*/

// How to use:
/* const myOfficeCeiling = calculateWall({
  wallWidth: 4,
  wallHeight: 5,
  labor: 100,
});
console.log("calculateWall: ", myOfficeCeiling); */
