
// useLocalStorage.js
import { useState, useEffect } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [data, setData] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const saveData = (newData) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const removeData = () => {
    try {
      window.localStorage.removeItem(key);
      setData(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [data, saveData, removeData];
};

export default useLocalStorage;

/**
  * ---  --- 
  * */
// LocalStorageComponent.js
import React from 'react';
import useLocalStorage from './useLocalStorage';

const LocalStorageComponent = () => {
  const [data, saveData, removeData] = useLocalStorage('meusDados', []);

  const handleAdd = (newItem) => {
    saveData([...data, newItem]);
  };

  const handleRemove = (id) => {
    saveData(data.filter((item) => item.id !== id));
  };

  return (
    <div>
      <h2>Dados:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.nome}
            <button onClick={() => handleRemove(item.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <input type="text" id="nome" placeholder="Nome" />
      <button onClick={() => handleAdd({ id: Date.now(), nome: document.getElementById('nome').value })}>
        Adicionar
      </button>
      <button onClick={removeData}>Limpar Tudo</button>
    </div>
  );
};

export default LocalStorageComponent;


// useLocalStorage.js (atualizado)
import { useState, useEffect } from 'react';

// Funções de criptografia
const encryptData = async (data, secretKey) => {
  const encoder = new TextEncoder();
  const key = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(JSON.stringify(data))
  );
  return [...iv, ...new Uint8Array(encrypted)];
};

const decryptData = async (encryptedData, secretKey) => {
  const decoder = new TextDecoder();
  const iv = encryptedData.slice(0, 12);
  const data = encryptedData.slice(12);
  const key = await window.crypto.subtle.importKey(
    'raw',
    decoder.encode(secretKey),
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );
  return JSON.parse(decoder.decode(decrypted));
};

const useLocalStorage = (key, initialValue, secretKey = null) => {
  const [data, setData] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;
      if (secretKey) {
        const encryptedData = new Uint8Array(item.split(',').map(Number));
        return decryptData(encryptedData, secretKey);
      }
      return JSON.parse(item);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const saveData = async (newData, useEncryption = !!secretKey) => {
    try {
      if (useEncryption && secretKey) {
        const encrypted = await encryptData(newData, secretKey);
        window.localStorage.setItem(key, encrypted.join(','));
      } else {
        window.localStorage.setItem(key, JSON.stringify(newData));
      }
      setData(newData);
    } catch (error) {
      console.error(error);
    }
  };

  const removeData = () => {
    try {
      window.localStorage.removeItem(key);
      setData(initialValue);
    } catch (error) {
      console.error(error);
    }
  };

  return [data, saveData, removeData];
};

export default useLocalStorage;


// LocalStorageComponent.js (atualizado)
import React, { useState } from 'react';
import useLocalStorage from './useLocalStorage';

const LocalStorageComponent = () => {
  const secretKey = 'minhaChaveSecreta123';
  const [data, saveData, removeData] = useLocalStorage('meusDados', [], secretKey);
  const [useEncryption, setUseEncryption] = useState(true);

  const handleAdd = (newItem) => {
    saveData([...data, newItem], useEncryption);
  };

  const handleRemove = (id) => {
    saveData(data.filter((item) => item.id !== id), useEncryption);
  };

  return (
    <div>
      <h2>Dados:</h2>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.nome}
            <button onClick={() => handleRemove(item.id)}>Remover</button>
          </li>
        ))}
      </ul>
      <input type="text" id="nome" placeholder="Nome" />
      <button onClick={() => handleAdd({ id: Date.now(), nome: document.getElementById('nome').value })}>
        Adicionar
      </button>
      <button onClick={removeData}>Limpar Tudo</button>
      <label>
        <input
          type="checkbox"
          checked={useEncryption}
          onChange={(e) => setUseEncryption(e.target.checked)}
        />
        Usar criptografia
      </label>
    </div>
  );
};

export default LocalStorageComponent;

