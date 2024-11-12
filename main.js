// Obter os elementos dos inputs
const nomeInput = document.getElementById("nome");
const ufInput = document.getElementById("uf");
const cpfInput = document.getElementById("cpf").value;

// Adicionar evento de "keydown" para o input de nome
nomeInput.addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        // Retira os símbolos e caracteres inválidos, deixando apenas números
        let cpfNumerico = cpfInput.replace(/\D/g, '');
        let nome = nomeInput.value;

        alert("Olá " + nome + "! Sua cor favorita é " + cpfNumerico + "!");
    }
});

ufInput.addEventListener('input', function() {
});

cpfInput.addEventListener('input', function() {
    //const 
});

// Fonte: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
//        https://devarthur.com/blog/funcao-javascript-para-validar-cpf

function validaCPF(cpf) {
    var Soma = 0
    var Resto
  
    var strCPF = String(cpf).replace(/[^d]/g, '')
    
    if (strCPF.length !== 11)
       return false
    
    if ([
      '00000000000',
      '11111111111',
      '22222222222',
      '33333333333',
      '44444444444',
      '55555555555',
      '66666666666',
      '77777777777',
      '88888888888',
      '99999999999',
      ].indexOf(strCPF) !== -1)
      return false
  
    for (i=1; i<=9; i++)
      Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  
    Resto = (Soma * 10) % 11
  
    if ((Resto == 10) || (Resto == 11)) 
      Resto = 0
  
    if (Resto != parseInt(strCPF.substring(9, 10)) )
      return false
  
    Soma = 0
  
    for (i = 1; i <= 10; i++)
      Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i)
  
    Resto = (Soma * 10) % 11
  
    if ((Resto == 10) || (Resto == 11)) 
      Resto = 0
  
    if (Resto != parseInt(strCPF.substring(10, 11) ) )
      return false
  
    return true
  }