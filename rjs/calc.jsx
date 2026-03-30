

// calc.jsx
import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return( <>
    <p className="flex items-center justify-center h-full bg-blue-200 text-4xl">{ "oi" }</p>
  </> );
}

createRoot( document.querySelector( "#app_root" ) ).render( <App /> );

