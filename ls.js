/**
 * --- LS: Gerenciador Seguro de LocalStorage
 */
const LS = {
  // SALVAR: Recebe uma chave (string) e um valor (objeto, array ou string)
  save(key, value) {
    try {
      // Converte o valor para string JSON antes de salvar
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Erro ao salvar no LocalStorage [${key}]:`, error);
      // Se o armazenamento estiver cheio (QuotaExceededError), avisar o usuário
      if (error.name === "QuotaExceededError") {
        alert(
          "Espaço de armazenamento cheio! Limpe alguns orçamentos antigos.",
        );
      }
      return false;
    }
  },

  // LER: Recebe a chave e retorna o dado já convertido para objeto/array
  get(key) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) return null;

      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(`Erro ao ler do LocalStorage [${key}]:`, error);
      return null;
    }
  },

  // REMOVER: Apaga uma chave específica
  remove(key) {
    localStorage.removeItem(key);
  },
};
// export async function save() {
//   try {
//     const key = await getEncryptionKey(password, "seu-salt-aqui");
//     const encrypted = await encryptData(data, key);
//     localStorage.setItem(keyName, encrypted);
//   } catch (e) {
//     console.error("Erro ao salvar dados seguros:", e);
//   }
// }
//
// export async function get() {
//   try {
//     const encrypted = localStorage.getItem(keyName);
//     if (!encrypted) return null;
//     const key = await getEncryptionKey(password, "seu-salt-aqui");
//     return await decryptData(encrypted, key);
//   } catch (e) {
//     console.error(
//       "Erro ao ler dados seguros (chave incorreta ou dados corrompidos):",
//       e,
//     );
//     return null;
//   }
// }
export default LS;
