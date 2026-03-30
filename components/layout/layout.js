/**
 * --- layout components --- */
import { trash, pencil } from "../../assets/icons.js";

export const serviceCard = (s) => `
  <service-card class="service-card" id="card-${s.id}">
    <header class="card-header">
      <div class="card-title">
        <h3>${s.room}</h3>
        <p>${s.ident || (s.type === "wall" ? Wall + " Parede" : "Forro")}</p>
      </div>
      <div class="badge">${s.type === "wall" ? "Parede" : "Forro"}</div>
    </header>
    <card-details class="card-details">
      <span>Área: <strong>${s.area.toFixed(2)} m²</strong></span>
      <span>Lã: <strong>${s.insulation ? "Sim" : "Não"}</strong></span>
    </card-list>
    <card-actions class="card-actions">
      <button class="btn-action btn-edit" onclick="editarServico(${s.id})">
        ${pencil}
      </button>
      <button class="btn-action btn-delete" onclick="removerServico(${s.id})">
        ${trash}
      </button>
    </card-actions>
  </service-card>
`;
