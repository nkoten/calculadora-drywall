import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const MinhaCalculadora = () => {
  // 1. Crie uma referência para a área que será impressa
  const areaImpressaoRef = useRef(null);

  // 2. Configure a função de impressão
  const dispararImpressao = useReactToPrint({
    contentRef: areaImpressaoRef, // Referência do que imprimir
    documentTitle: "Resultado_Calculo", // Nome do arquivo PDF
    onAfterPrint: () => console.log("Impressão finalizada!")
  });

  return (
    <div className="p-4">
      {/* Botão para disparar a ação */}
      <button 
        onClick={() => dispararImpressao()} 
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Imprimir Resultado
      </button>

      {/* Conteúdo que será enviado para a impressora */}
      <div ref={areaImpressaoRef} className="p-8 border bg-white text-black">
        <h1 className="text-2xl font-bold">Relatório de Cálculo</h1>
        <p>Este conteúdo será impresso exatamente como aparece aqui.</p>
        {/* Seus dados da calculadora aqui */}
      </div>
    </div>
  );
};

