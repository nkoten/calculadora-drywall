import React, { useState, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";

import LS from "./ls.js";
import calculateCeiling from "./scripts/calculators/calculateCeiling.js";
import calculateWall from "./scripts/calculators/w111Calculator.js";
import { trash, pencil, Ceiling, Wall } from "./assets/icons.js";

const App = () => {
  const [serviceList, setServiceList] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Estados do Form
  const [roomName, setRoomName] = useState("");
  const [serviceType, setServiceType] = useState("ceiling");
  const [identification, setIdentification] = useState("");
  const [includeInsulation, setIncludeInsulation] = useState(false);

  // Usando crypto.randomUUID() para IDs iniciais
  const [measures, setMeasures] = useState([
    { id: crypto.randomUUID(), width: "", length: "" },
  ]);
  const [openings, setOpenings] = useState([]);

  useEffect(() => {
    const saved = LS.get("dw-services");
    if (saved) setServiceList(saved);
  }, []);

  useEffect(() => {
    LS.save("dw-services", serviceList);
  }, [serviceList]);

  // --- CÁLCULO DE ÁREA LÍQUIDA (Igual ao original) ---
  const calculateCurrentArea = () => {
    const totalBruto = measures.reduce(
      (acc, m) => acc + Number(m.width) * Number(m.length),
      0,
    );
    const totalDesconto = openings.reduce(
      (acc, o) => acc + Number(o.width) * Number(o.height),
      0,
    );
    return Math.max(0, totalBruto - totalDesconto);
  };

  // --- ACUMULADOR DE MATERIAIS (ESTRUTURA ORIGINAL) ---
  const materiaisAcumulados = useMemo(() => {
    // Inicializamos o objeto exatamente com as chaves das tuas funções
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
      const safety = 1.05; // 5% de margem fixa como no teu original

      // Chamada das funções originais mantendo a fidelidade
      const result =
        s.type === "ceiling"
          ? calculateCeiling({
              width: s.measures[0].width,
              length: s.measures[0].length,
              safety,
            }).data
          : calculateWall({
              wallWidth: s.measures[0].width,
              wallHeight: s.measures[0].length,
              openings: s.openings,
              safety,
            }).data;

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
    });

    return total;
  }, [serviceList]);

  // --- Mapeamento para Renderização (Nomes Originais) ---
  const renderRows = [
    {
      desc: "Placa Drywall ST",
      qty: materiaisAcumulados.boards.drywallSheets,
      unit: 38.9,
    },
    {
      desc: "Perfil F530 (3m)",
      qty: materiaisAcumulados.framing.f530Profiles,
      unit: 19.9,
    },
    {
      desc: "Tabica (3m)",
      qty: materiaisAcumulados.framing.perimeterTracks,
      unit: 24.9,
    },
    {
      desc: "Guia 48mm (3m)",
      qty: materiaisAcumulados.framing.runners3m,
      unit: 24.67,
    },
    {
      desc: "Montante 48mm (3m)",
      qty: materiaisAcumulados.framing.studs3m,
      unit: 29.6,
    },
    {
      desc: "Lã de Vidro/Pet (m²)",
      qty: materiaisAcumulados.insulation.insulationM2,
      unit: 15.0,
    },
    {
      desc: "Parafuso GN25 (Cento)",
      qty: Math.ceil(materiaisAcumulados.fixings.drywallScrews / 100),
      unit: 18.0,
    },
    {
      desc: "Parafuso Lentilha (Cento)",
      qty: Math.ceil(materiaisAcumulados.fixings.framingScrews / 100),
      unit: 12.0,
    },
    {
      desc: "Parafuso / Bucha n°6",
      qty: materiaisAcumulados.fixings.wallPlugsAndScrews,
      unit: 0.5,
    },
    {
      desc: "Fita Telada (m)",
      qty: materiaisAcumulados.finishing.jointTapeMeters,
      unit: 1.2,
    },
    {
      desc: "Massa p/ Drywall (kg)",
      qty: Math.ceil(materiaisAcumulados.finishing.jointCompoundKg),
      unit: 8.0,
    },
  ].filter((row) => row.qty > 0);

  // --- FUNÇÕES DE AÇÃO ---
  const handleSave = (e) => {
    e.preventDefault();
    const service = {
      id: editingId || crypto.randomUUID(),
      room: roomName,
      type: serviceType,
      ident: identification,
      insulation: includeInsulation,
      area: calculateCurrentArea(),
      measures: [...measures],
      openings: [...openings],
    };

    if (editingId) {
      setServiceList(
        serviceList.map((s) => (s.id === editingId ? service : s)),
      );
    } else {
      setServiceList([...serviceList, service]);
    }
    setIsDrawerOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setRoomName("");
    setServiceType("ceiling");
    setIdentification("");
    setIncludeInsulation(false);
    setMeasures([{ id: crypto.randomUUID(), width: "", length: "" }]);
    setOpenings([]);
    setEditingId(null);
  };

  // ... (Restante do JSX com as tabelas e drawer já definidos)
};
