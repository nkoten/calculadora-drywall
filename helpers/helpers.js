/**
 * Seletor inteligente estilo jQuery
 * @param {string} selector - O seletor CSS (ex: "#id", ".classe", "div")
 * @param {Element} [context=document] - Onde procurar o elemento (opcional)
 * @returns {Element|NodeList|null} - Retorna um elemento único, uma lista ou null
 */
export const $ = (selector, context = document) => {
  const elements = context.querySelectorAll(selector);

  // Se não encontrar nada, retorna null
  if (elements.length === 0) return null;

  // Se encontrar apenas um, retorna o elemento direto (estilo $('#id'))
  // Se encontrar vários, retorna a NodeList (estilo $('.classe'))
  return elements.length === 1 ? elements[0] : elements;
};
/* --- usage 
const form = $('#serviceForm'); 
Retorna o elemento direto

const inputs = $('.input-width'); 
Retorna uma NodeList (Array-like)
inputs.forEach(i => console.log(i.value));

Imagina que você tem o card de um serviço
const card = $('#card-12345');
const btnDelete = $('.btn-delete', card); 
Procura o botão APENAS dentro desse card específico
*/

/**
 * Seletor inteligente estilo jQuery
 * @param {string} selector - O seletor CSS (ex: "#id", ".classe", "div")
 * @param {Element} [context=document] - Onde procurar o elemento (opcional)
 * @returns {Element|NodeList|null} - Retorna um elemento único, uma lista ou null
 */
export const $$ = (selector, context = document) => {
  const elements = context.querySelectorAll(selector);

  // Se não encontrar nada, retorna null
  // if (elements.length === 0) return null;

  return elements;
};

/**
 * --- retorna o objeto passado como um Array
 *  @param objeto - objeto para converter em Array
 *  */
export function oList(objeto) {
  return Object.values(objeto);
}

Object.defineProperty(Object.prototype, "oMap", {
  value: function (cb) {
    return Object.values(this).map(cb);
  },
  enumarable: false,
  configurable: true,
});

/**
  * --- log() ---
  *  */
export const log = ( ...args ) => console.log(
  "\n\n\n=== log() ===\n", ...args
);


