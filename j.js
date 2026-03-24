
// Arquivo: j.js

function J(arg) {
    console.log("O argumento recebido foi:", arg);
    // Sua lógica de cálculo aqui...
}

// Pega o argumento da posição 2 (o primeiro que você digita após o nome do arquivo)
const myArg = process.argv[2];

// Chama a função passando esse argumento
J(myArg);

