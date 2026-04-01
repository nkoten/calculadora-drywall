<FAB
  acions={[
    {
      label: "Novo Cálculo",
      icon: "🏠",
      action: () => handleOpenDrawer(),
    },
    {
      label: "Salvar como Imagem",
      icon: "🧱",
      action: () => exportAsImage({ ref: pdfRef }),
    },
    {
      label: "Imprimir PDF",
      icon: "🖨️",
      action: () => handlePrint(),
    },
  ]}
/>;

const FAB = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filtra apenas ações que devem ser visíveis (ex: ignorar print se a lista estiver vazia)
  const visibleActions = actions.filter((action) => action.show !== false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col-reverse items-end gap-3 no-print z-50">
      {/* Botão Principal (Trigger) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center gap-2 h-14 px-4 rounded-xl shadow-lg transition-all duration-200 
          ${isOpen ? "bg-zinc-800" : "bg-zinc-900"} text-zinc-50 hover:bg-zinc-800 active:scale-95`}
      >
        <span
          className={`transition-transform duration-200 ${isOpen ? "rotate-45" : "rotate-0"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-7-7v14" />
          </svg>
        </span>
        {!isOpen && <span className="font-medium text-sm">Ações</span>}
      </button>

      {/* Menu de Opções */}
      {isOpen && (
        <div className="flex flex-col mb-2 gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {visibleActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 bg-white border border-zinc-200 px-4 py-3 rounded-lg shadow-sm hover:bg-zinc-50 text-zinc-900 transition-colors whitespace-nowrap"
            >
              <Icon
                name={action.icon}
                className={`${action.iconColor || "text-zinc-500"} scale-110`}
              />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* normal */
<fab className="fab-button no-print" onClick={handleOpenDrawer}>
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
</fab>;
