/**
 * --- global script for calculator page ---
 *  */

/**
 * --- helpers ---
 */
const brlFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
// brlFormat.format( 1000 );

const toBrl = (str) => {
  // remove all occurencies of '.'
  let sanitized = str.replace(/\./g, "");
  // Replace the decimal comma with a decimal point
  sanitized = sanitized.replace(",", ".");
  // Convert the sanitized string to a floating-point number
  const numbr = parseFloat(sanitized);
  return numbr;
};

function _$(numbr) {
  return toBrl(brlFormat.format(numbr).replace("R$", ""))
    .toFixed(2)
    .replace(".", ",");
}
/* --- helpers --- */

/* --- print handler --- */
function handlePrint() {
  window.print();
}
/* --- end print handler --- */

function initTable() {
  document.querySelector("#tbody").innerHTML = `${[...Array(6)]
    .map((item) => {
      return `<tr>${[...Array(4)].map((td) => {
        return `<td></td>`;
      })}</tr>`;
    })
    .join(",")
    .replace(/,/g, "")}`;
}

/* --- init --- */
function init() {
  initTable();
}
init();
/* --- end init --- */

/**
 * --- drawer --- */
const drawerOverlay = document.querySelector("#drawerOverlay");
const openDrawerBtn = document.querySelector("#openDrawer");
const closeDrawerBtn = document.querySelector("#closeDrawer");
const applyBtn = document.querySelector("#applyAndClose");

// Função para abrir
openDrawerBtn.addEventListener("click", () => {
  drawerOverlay.classList.add("active");
  openDrawerBtn.style.display = "none"; // Esconde o FAB
  document.body.style.overflow = "hidden";
});

// Função para fechar
const closeDrawer = () => {
  drawerOverlay.classList.remove("active");
  openDrawerBtn.style.display = "flex"; // Mostra o FAB de volta
  document.body.style.overflow = "";
};

closeDrawerBtn.addEventListener("click", closeDrawer);
if (applyBtn) applyBtn.addEventListener("click", closeDrawer);

// Fechar ao clicar no fundo escuro
drawerOverlay.addEventListener("click", (e) => {
  if (e.target === drawerOverlay) closeDrawer();
});
/* --- end drawer --- */
