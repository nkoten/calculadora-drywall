/** --- imports --- */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { useReactToPrint } from "react-to-print";

// Importação dos teus utilitários e lógica
import LS from "./ls.js";
import calculateCeiling from "./scripts/calculators/calculateCeiling.js";
import { log } from "./helpers/helpers.js";
import calculateWall from "./scripts/calculators/w111Calculator.js";
import { trash, pencil, Ceiling, Wall } from "./assets/icons.js";
import * as Icons from "./assets/icons.js";
/* --- end imports --- */

/**
 * --- Drywall Calculator App ---
 *  */
const App = () => {
  // --- ESTADOS GLOBAIS ---
  const [serviceList, setServiceList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // --- ESTADOS DO FORMULÁRIO (DRAWER) ---
  const [roomName, setRoomName] = useState("");
  const [serviceType, setServiceType] = useState("ceiling"); // 'ceiling' ou 'wall'
  const [identification, setIdentification] = useState("");
  const [includeInsulation, setIncludeInsulation] = useState(false);
  const [measures, setMeasures] = useState([
    { id: crypto.randomUUID(), width: "", length: "" },
  ]);
  const [openings, setOpenings] = useState([]);

  // referencia para o elemento de impressao
  const pdfRef = useRef(null);

  // 
  const handlePrint = useReactToPrint({
    contentRef: pdfRef, // Referência do que imprimir
    documentTitle: "Resultado_Calculo", // Nome do arquivo PDF
    onAfterPrint: () => console.log("Impressão finalizada!")
  });

  // --- PERSISTÊNCIA (LS.js) ---
  useEffect(() => {
    const saved = LS.get("dw-services");
    if (saved) setServiceList(saved);
  }, []);

  useEffect(() => {
    LS.save("dw-services", serviceList);
  }, [serviceList]);

  // --- LÓGICA DE INTERFACE ---
  const resetForm = () => {
    setRoomName("");
    setServiceType("ceiling");
    setIdentification("");
    setIncludeInsulation(false);
    setMeasures([{ id: crypto.randomUUID(), width: "", length: "" }]);
    setOpenings([]);
    setEditingId(null);
  };

  const handleOpenDrawer = () => {
    resetForm();
    setIsDrawerOpen(true);
  };

  const calculateCurrentArea = () => {
    const totalBruto = measures.reduce(
      (acc, m) => acc + Number(m.width) * Number(m.length),
      0,
    );
    const totalDesconto = openings.reduce(
      (acc, o) => acc + Number(o.width) * Number(o.height),
      0,
    );
    // return Math.max(0, totalBruto - totalDesconto).toFixed(2);
    return Math.max(0, totalBruto - totalDesconto);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const serviceData = {
      id: editingId || crypto.randomUUID(),
      room: roomName,
      type: serviceType,
      ident: identification,
      // insulation: serviceType === "wall" ? includeInsulation : false,
      insulation: includeInsulation,
      // area: Number(calculateCurrentArea()),
      area: calculateCurrentArea(),
      measures: [...measures],
      openings: [...openings],
    };

    if (editingId) {
      setServiceList(
        serviceList.map((s) => (s.id === editingId ? serviceData : s)),
      );
    } else {
      setServiceList([...serviceList, serviceData]);
    }
    setIsDrawerOpen(false);
    resetForm();
  };

  const handleEdit = (s) => {
    setEditingId(s.id);
    setRoomName(s.room);
    setServiceType(s.type);
    setIdentification(s.ident);
    setIncludeInsulation(s.insulation);
    setMeasures(s.measures);
    setOpenings(s.openings);
    setIsDrawerOpen(true);
  };

  // --- ACUMULADOR DE MATERIAIS ---
  const totalMaterials = useMemo(() => {
    // inicialização do objeto acumulador de materiais
    const total = {
      dimensions: { area: 0, perimeter: 0 },
      boards: { drywallSheets: 0 },
      framing: {
        f530Profiles: 0,
        perimeterTracks: 0,
        suspensionKits: 0,
        runners3m: 0,
        studs3m: 0,
      },
      insulation: { insulationM2: 0 },
      fixings: { drywallScrews: 0, framingScrews: 0, wallPlugsAndScrews: 0 },
      finishing: { jointTapeMeters: 0, jointCompoundKg: 0 },
    };

    serviceList.forEach((s) => {
      const safety = 1.0; // 5% margem
      // Usamos a primeira medida ou a soma delas para o calculador base
      const width = Number( s.measures[0].width );
      const length = Number( s.measures[0].length );

      // Chamada das funções originais mantendo a fidelidade
      const result =
        s.type === "ceiling"
          ? calculateCeiling({
              width,
              length,
              safety,
            }).data
          : calculateWall({
              wallWidth: width,
              wallHeight: length,
              openings: s.openings,
              safety,
            }).data;

      log("result: ", result);
      // Soma manual respeitando cada campo original
      total.boards.drywallSheets += result.boards.drywallSheets;
      total.fixings.drywallScrews += result.fixings.drywallScrews;
      total.fixings.framingScrews += result.fixings.framingScrews;
      total.finishing.jointTapeMeters += result.finishing.jointTapeMeters;
      total.finishing.jointCompoundKg += Number(
        result.finishing.jointCompoundKg,
      );
      total.fixings.wallPlugsAndScrews +=
        result.fixings.wallPlugsAndScrews ||
        result.fixings.wallAnchorsAndScrews ||
        0;

      if (s.type === "ceiling") {
        total.dimensions.area += Number(result.dimensions.area);
        total.framing.f530Profiles += result.framing.f530Profiles;
        total.framing.perimeterTracks += result.framing.perimeterTracks;
        total.framing.suspensionKits += result.framing.suspensionKits;
      } else {
        total.dimensions.area += Number(result.dimensions.totalBoardArea);
        total.framing.runners3m += result.framing.runners3m;
        total.framing.studs3m += result.framing.studs3m;
        total.insulation.insulationM2 += result.insulation.insulationM2 || 0;
      }
      log("resultado: ", result);
    });

    return total;
  }, [serviceList]);

  // Mapeamento para Renderização dos Itens da Tabela com preços do seu original
  const tableRows = [
    {
      desc: "Placa Drywall ST",
      qty: totalMaterials.boards.drywallSheets,
      unit: 38.9,
    },
    {
      desc: "Tabica (3m)",
      qty: totalMaterials.framing.perimeterTracks,
      unit: 24.9,
    },
    {
      desc: "Perfil F530 (3m)",
      qty: totalMaterials.framing.f530Profiles,
      unit: 19.9,
    },
    {
      desc: "Guia 48mm (3m)",
      qty: totalMaterials.framing.runners3m,
      unit: 24.67,
    },
    {
      desc: "Montante 48mm (3m)",
      qty: totalMaterials.framing.studs3m,
      unit: 29.6,
    },
    {
      desc: "Lã de Vidro/Pet (m²)",
      qty: totalMaterials.insulation.insulationM2,
      unit: 15.0,
    },
    {
      desc: "Parafuso GN25 (Cento)",
      qty: Math.ceil(totalMaterials.fixings.drywallScrews / 100),
      unit: 18.0,
    },
    {
      desc: "Parafuso Lentilha (Cento)",
      qty: Math.ceil(totalMaterials.fixings.framingScrews / 100),
      unit: 12.0,
    },
    {
      desc: "Parafuso / Bucha n°6",
      qty: totalMaterials.fixings.wallPlugsAndScrews,
      unit: 0.5,
    },
    {
      desc: "Fita Telada (m)",
      qty: totalMaterials.finishing.jointTapeMeters,
      unit: 1.2,
    },
    {
      desc: "Massa p/ Drywall (kg)",
      qty: Math.ceil(totalMaterials.finishing.jointCompoundKg),
      unit: 8.0,
    },
  ].filter((row) => row.qty > 0);

  const totalGeral = tableRows.reduce(
    // (sum, row) => sum + row.qty * row.price,
    (sum, row) => sum + row.qty * row.unit,
    0,
  );

  return (
    <>
      {/* --- print header --- */}
      <div className="hidden print:block mb-8 border-b-2 border-[#152b54] pb-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#152b54]">
              Orçamento de Drywall
            </h1>
            <p className="text-sm text-slate-500">
              Gerado em: {new Date().toLocaleDateString("pt-BR")}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold">Calculadora Drywall Pro</p>
            <p className="text-xs">Relatório Técnico de Materiais</p>
          </div>
        </div>
      </div>
      {/* --- end print header --- */}

      <div className="min-h-screen bg-white">
        <main className="p-4 max-w-4xl mx-auto">
          <header className="flex items-center justify-center h-[78px]">
            <h1 className="service-name text-[1.4rem] font-bold text-[#171e31]">
              Lista de Materiais
            </h1>
          </header>

          {/* Cards de Serviços */}
          <div className="saved-services-list mb-6">
            {serviceList.map((s) => (
              <div
                key={s.id}
                className="service-card p-4 mb-4 bg-white shadow-md border border-[#e2e8f000] rounded-[1.5rem]"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-[#4f46e5]">{s.room}</h3>
                    <p className="text-xs text-slate-500">
                      {s.ident || "Geral"}
                    </p>
                  </div>
                  {
                    <div
                      className={`badge ${s.type === "wall" ? "bg-green-100" : "bg-indigo-100"} ${s.type === "wall" ? "text-green-600" : "text-indigo-600"} px-3 py-1 rounded-full text-[10px] font-bold uppercase`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name={s.type === "wall" ? "Wall" : "Ceiling"} />
                        {s.type === "wall" ? "Parede" : "Forro"}
                      </span>
                    </div>
                  }
                </div>
                <div className="text-[13px] flex gap-4 text-slate-600 mb-3">
                  <span>
                    Área: <strong>{s.area.toFixed(2)} m²</strong>
                  </span>
                  {s.type === "wall" && (
                    <span>
                      Lã: <strong>{s.insulation ? "Sim" : "Não"}</strong>
                    </span>
                  )}
                </div>
                <div className="flex gap-2 border-t pt-2 border-slate-200">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(s)}
                    dangerouslySetInnerHTML={{ __html: pencil }}
                  />
                  <button
                    className="btn-action btn-delete"
                    onClick={() =>
                      setServiceList(serviceList.filter((x) => x.id !== s.id))
                    }
                    dangerouslySetInnerHTML={{ __html: trash }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tabela de Materiais */}
          <div className="shadow-sm overflow-hidden">
            <table ref={pdfRef} className="w-full border-collapse">
              <thead>
                <tr className="bg-[#111d41] text-white text-[0.8rem] uppercase">
                  <th className="p-2 text-right">qtd.</th>
                  <th className="p-2 text-left">descrição</th>
                  <th className="p-2 text-left">R$ unit.</th>
                  <th className="p-2 text-left">total</th>
                </tr>
              </thead>
              <tbody className="text-[14px]">
                {tableRows.map((row, i) => (
                  <tr
                    key={i}
                    className={i % 2 === 0 ? "bg-[#eef4f4]" : "bg-[#e3e7e8]"}
                  >
                    <td className="p-2 text-right font-bold">{row.qty}</td>
                    <td className="p-2">{row.desc}</td>
                    <td className="p-2">{row.unit.toFixed(2)}</td>
                    <td className="p-2 font-bold text-[#000304]">
                      {(row.qty * row.unit).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#152b54] text-white text-xl">
                  <td colSpan="4" className="p-4 text-center font-bold">
                    Total Estimado: R$ {totalGeral.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* --- legal-notice on print --- */}
          <p class="legal-notice hidden" forprint>
            * Os valores dos materiais são estimativos e podem variar de acordo
            com a loja e a data da compra.
          </p>
          {/* --- end legal-notice on print --- */}

          <button
            className="w-full h-[56px] bg-[#00559c] text-white rounded-[1.1rem] mt-6 no-print"
            onClick={ () => {
              // window.print();
              handlePrint();
            } }
          >
            Imprimir / Gerar PDF
          </button>
        </main>

        {/* FAB */}
        {!isDrawerOpen && (
          <button className="fab-button no-print" onClick={handleOpenDrawer}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14m-7-7v14" />
            </svg>
            <span className="fab-text">Calcular</span>
          </button>
        )}

        {/* Drawer */}
        {isDrawerOpen && (
          <drawer
            className="drawer-overlay active no-print bg-white"
            onClick={(e) =>
              e.target.classList.contains("drawer-overlay") &&
              setIsDrawerOpen(false)
            }
          >
            <header className="flex flex-col bg-white items-center justify-center sticky top-0 left-0 w-full h-[fit-content] p-4">
              <div
                className="drawer-handle"
                onClick={() => setIsDrawerOpen(false)}
              ></div>
              <h2 className="text-[1rem] font-black uppercase text-indigo-900">
                Adicionar Serviço
              </h2>
              <div id="serviceCount" class="service-count">
                <pill total-services> 1 serviços na lista </pill>
              </div>
            </header>
            <form
              id="form"
              className="bg-white p-4 pb-[160px] h-full overflow-y-auto"
              onSubmit={handleSaveService}
            >
              <service-info className="flex flex-col gap-2">
                <label className="block">
                  <span className="label-text capitalize">Cômodo</span>
                  <input
                    type="text"
                    className="drawer-input w-full mt-1"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    required
                    placeholder="Ex: Quarto, Sala, Cozinha"
                  />
                </label>

                <label className="block">
                  <span className="label-text capitalize">Identificação</span>
                  <input
                    type="text"
                    className="drawer-input w-full"
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    placeholder="Ex: Parede Leste"
                  />
                </label>
              </service-info>

              <service-selector className="flex min-h-[36px] shrink-0 border border-slate-300 rounded-[1rem] overflow-hidden p-[.25rem] relative items-center">
                <button
                  type="button"
                  className={`btn-select flex-1 p-2 ${serviceType === "ceiling" ? "active" : ""} rounded-[0.9rem_0_0_0.9rem_!important]`}
                  onClick={() => setServiceType("ceiling")}
                >
                  <Icon name="Ceiling" className="" />
                  Forro
                </button>
                <button
                  type="button"
                  className={`btn-select flex-1 p-2 ${serviceType === "wall" ? "active" : ""} rounded-[0_0.9rem_0.9rem_0_!important]`}
                  onClick={() => setServiceType("wall")}
                >
                  <Icon name="Wall" className="" />
                  Parede
                </button>
              </service-selector>

              {serviceType === "wall" && (
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg mb-4">
                  <span className="text-[12px] font-[700] text-amber-600">
                    Incluir Lã de Vidro/Pet?
                  </span>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={includeInsulation}
                      onChange={(e) => setIncludeInsulation(e.target.checked)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              )}

              {measures.map((m, i) => (
                <measure-row
                  key={m.id}
                  className="grid grid-cols-2 gap-2 mb-2 items-end"
                >
                  <label>
                    <span className="label-t-s text-[10px]">Largura</span>
                    <input
                      type="number"
                      step="0.01"
                      className="drawer-input"
                      value={m.width}
                      onChange={(e) => {
                        const copy = [...measures];
                        copy[i].width = e.target.value;
                        setMeasures(copy);
                      }}
                      required
                    />
                  </label>
                  <label>
                    <span className="label-t-s text-[10px]">
                      {serviceType === "wall" ? "Altura" : "Comprimento"}
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      className="drawer-input"
                      value={m.length}
                      onChange={(e) => {
                        const copy = [...measures];
                        copy[i].length = e.target.value;
                        setMeasures(copy);
                      }}
                      required
                    />
                  </label>
                </measure-row>
              ))}

              <button
                type="button"
                className="text-xs font-bold text-indigo-600 border-dashed border-2 border-indigo-100 w-[90%] h-[calc(0.25rem_*_9)] p-2 rounded-[calc(0.625rem_+_4px)] m-[0_auto]"
                onClick={() =>
                  setMeasures([
                    ...measures,
                    { id: Date.now(), width: "", length: "" },
                  ])
                }
              >
                + Medida Extra
              </button>

              <visor-area className="bg-indigo-600 w-[90%] text-white p-4 rounded-[calc(0.625rem_+_4px)] flex justify-between items-center m-[0_auto] shadow-sm">
                <left className="text-xs">
                  <span className="text-[12px] font-bold opacity-[.8] uppercase">
                    Área Calculada
                  </span>
                  <small className="text-[12px] opacity-[.7] italic">
                    (Bruta - Vãos)
                  </small>
                </left>
                <right className="text-[20px] font-bold">
                  {calculateCurrentArea()} m²
                </right>
              </visor-area>
            </form>
            <footer className="flex flex-col items-center justify-center w-full h-[fit-content] p-4 bottom-0 left-0 bg-sky-50">
              <button
                type="submit"
                form="form"
                className="btn-save-temp w-full bg-[#00559c] text-white p-4 rounded-xl mt-6"
              >
                {editingId ? "Atualizar Serviço" : "Salvar Serviço"}
              </button>
            </footer>
          </drawer>
        )}
      </div>
    </>
  );
};

const root = createRoot(document.getElementById("app_root"));
root.render(<App />);

const Icon = ({ name, className = "" }) => {
  // Acessa o ícone pelo nome (ex: "trash", "Wall")
  const svgString = Icons[name];

  if (!svgString) return null;

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      dangerouslySetInnerHTML={{ __html: svgString }}
    />
  );
};

// Exemplo de uso:
// <Icon name="trash" className="text-red-500" />
// <Icon name="Ceiling" />
