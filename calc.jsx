import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";

// Importação dos teus utilitários e lógica
import LS from "./ls.js";
import calculateCeiling from "./scripts/calculators/calculateCeiling.js";
import calculateWall from "./scripts/calculators/w111Calculator.js";
import { trash, pencil, Ceiling, Wall } from "./assets/icons.js";

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
    { id: Date.now(), width: "", length: "" },
  ]);
  const [openings, setOpenings] = useState([]);

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
    setMeasures([{ id: Date.now(), width: "", length: "" }]);
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
    return Math.max(0, totalBruto - totalDesconto).toFixed(2);
  };

  const handleSaveService = (e) => {
    e.preventDefault();
    const serviceData = {
      id: editingId || Date.now(),
      room: roomName,
      type: serviceType,
      ident: identification,
      insulation: serviceType === "wall" ? includeInsulation : false,
      area: Number(calculateCurrentArea()),
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

  // --- MOTOR DE CÁLCULO ACUMULADO ---
  const totalMaterials = useMemo(() => {
    const acc = {
      boards: 0,
      framing: { f530: 0, tracks: 0, kits: 0, runners: 0, studs: 0 },
      fixings: { gn25: 0, lentilha: 0, plugs: 0 },
      finishing: { tape: 0, compound: 0 },
      insulation: 0,
      totalArea: 0,
    };

    serviceList.forEach((s) => {
      const safety = 1.00 // 5% margem
      // Usamos a primeira medida ou a soma delas para o calculador base
      const width = s.measures[0].width;
      const length = s.measures[0].length;

      const calc =
        s.type === "ceiling"
          ? calculateCeiling({ width, length, safety }).data
          : calculateWall({
              wallWidth: width,
              wallHeight: length,
              safety,
              openings: s.openings,
            }).data;

      acc.boards += calc.boards.drywallSheets;
      acc.fixings.gn25 += calc.fixings.drywallScrews;
      acc.fixings.lentilha += calc.fixings.framingScrews;
      acc.finishing.tape += calc.finishing.jointTapeMeters;
      acc.finishing.compound += Number(calc.finishing.jointCompoundKg);
      acc.fixings.plugs += calc.fixings.wallPlugsAndScrews;
      acc.totalArea += s.area;

      if (s.type === "ceiling") {
        acc.framing.tracks += calc.framing.perimeterTracks;
        acc.framing.f530 += calc.framing.f530Profiles;
        acc.framing.kits += calc.framing.suspensionKits;
      } else {
        acc.framing.runners += calc.framing.runners3m;
        acc.framing.studs += calc.framing.studs3m;
        if (s.insulation) acc.insulation += calc.insulation.insulationM2;
      }
    });
    return acc;
  }, [serviceList]);

  // Itens da Tabela com preços do seu original
  const tableRows = [
    { desc: "Placa Drywall ST", qty: totalMaterials.boards, price: 38.9 },
    {
      desc: "Perfil / Tabica (3m)",
      qty:
        totalMaterials.framing.tracks +
        totalMaterials.framing.runners +
        totalMaterials.framing.f530 +
        totalMaterials.framing.studs,
      price: 22.5,
    },
    {
      desc: "Parafuso GN25 (Cento)",
      qty: Math.ceil(totalMaterials.fixings.gn25 / 100),
      price: 18.0,
    },
    {
      desc: "Parafuso Lentilha (Cento)",
      qty: Math.ceil(totalMaterials.fixings.lentilha / 100),
      price: 12.0,
    },
    {
      desc: "Bucha e Parafuso nº6",
      qty: totalMaterials.fixings.plugs,
      price: 0.5,
    },
    { desc: "Fita Telada (m)", qty: totalMaterials.finishing.tape, price: 1.2 },
    {
      desc: "Massa Drywall (kg)",
      qty: Math.ceil(totalMaterials.finishing.compound),
      price: 8.5,
    },
    {
      desc: "Lã de Vidro/Pet (m²)",
      qty: totalMaterials.insulation,
      price: 15.0,
    },
  ].filter((r) => r.qty > 0);

  const totalGeral = tableRows.reduce((sum, r) => sum + r.qty * r.price, 0);

  return ( <>
    {/* --- print header --- */}
    <div className="hidden print:block mb-8 border-b-2 border-[#152b54] pb-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#152b54]">Orçamento de Drywall</h1>
          <p className="text-sm text-slate-500">Gerado em: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="text-right">
          <p className="font-bold">Calculadora Drywall Pro</p>
          <p className="text-xs">Relatório Técnico de Materiais</p>
        </div>
      </div>
    </div>
    {/* --- end print header --- */}

    <div className="min-h-screen bg-white">
      <main className="p-[10px] max-w-4xl mx-auto">
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
              className="service-card p-4 mb-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-[1.5rem]"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-[#4f46e5]">{s.room}</h3>
                  <p className="text-xs text-slate-500">{s.ident || "Geral"}</p>
                </div>
                <div className="badge bg-[#e0e7ff] text-[#4f46e5] px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                  {s.type === "wall" ? "Parede" : "Forro"}
                </div>
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
        <div className="card shadow-sm overflow-hidden">
          <table className="w-full border-collapse">
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
                  <td className="p-2">{row.price.toFixed(2)}</td>
                  <td className="p-2 font-bold text-[#000304]">
                    {(row.qty * row.price).toFixed(2)}
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
          * Os valores dos materiais são estimativos e podem variar de acordo com a
          loja e a data da compra.
        </p>
        {/* --- end legal-notice on print --- */}

        <button
          className="w-full h-[56px] bg-[#00559c] text-white rounded-[1.1rem] mt-6 no-print"
          onClick={() => window.print()}
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
        <div
          className="drawer-overlay active no-print"
          onClick={(e) =>
            e.target.classList.contains("drawer-overlay") &&
            setIsDrawerOpen(false)
          }
        >
          <header className="drawer-header">
            <div
              className="drawer-handle"
              onClick={() => setIsDrawerOpen(false)}
            ></div>
            <h2 className="text-[1rem] font-black uppercase text-[#312c85]">
              Adicionar Serviço
            </h2>
          </header>
          <form
            className="bg-white p-4 h-full overflow-y-auto"
            onSubmit={handleSaveService}
          >
            <label className="mb-4 block">
              <span className="label-text">Cômodo</span>
              <input
                type="text"
                className="w-full mt-1"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
                placeholder="Ex: Sala"
              />
            </label>

            <service-selector className="flex border border-slate-300 rounded-lg overflow-hidden mb-4">
              <button
                type="button"
                className={`btn-select flex-1 p-2 ${serviceType === "ceiling" ? "active" : ""}`}
                onClick={() => setServiceType("ceiling")}
              >
                Forro
              </button>
              <button
                type="button"
                className={`btn-select flex-1 p-2 ${serviceType === "wall" ? "active" : ""}`}
                onClick={() => setServiceType("wall")}
              >
                Parede
              </button>
            </service-selector>

            <label className="mb-4 block">
              <input
                type="text"
                className="w-full"
                value={identification}
                onChange={(e) => setIdentification(e.target.value)}
                placeholder="Identificação (Ex: Parede Leste)"
              />
            </label>

            {serviceType === "wall" && (
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg mb-4">
                <span className="text-xs font-bold text-amber-700 uppercase">
                  Incluir Lã?
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
              className="text-xs font-bold text-indigo-600 border-dashed border-2 border-indigo-100 w-full p-2 rounded-lg mt-2"
              onClick={() =>
                setMeasures([
                  ...measures,
                  { id: Date.now(), width: "", length: "" },
                ])
              }
            >
              + Medida Extra
            </button>

            <visor-area className="bg-[#4f46e5] text-white p-4 rounded-xl flex justify-between items-center mt-6">
              <div className="text-xs">
                <span>Área Calculada</span>
                <br />
                <small>(Líquida)</small>
              </div>
              <div className="text-2xl font-bold">
                {calculateCurrentArea()} m²
              </div>
            </visor-area>

            <button
              type="submit"
              className="btn-save-temp w-full bg-[#18181b] text-white p-4 rounded-xl mt-6"
            >
              {editingId ? "Atualizar Serviço" : "Salvar Serviço"}
            </button>
          </form>
        </div>
      )}
    </div>
  </> );
};

const root = createRoot(document.getElementById("app_root"));
root.render(<App />);
