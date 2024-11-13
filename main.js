// Obter os elementos
const nomeInput = document.getElementById("nome");
const ufSelect = document.getElementById("uf");
const cpfInput = document.getElementById("cpf");
const botaoButton = document.getElementById("botao");
let nomeErro = document.getElementById("nomeErro");
let ufErro = document.getElementById("ufErro");
let cpfErro = document.getElementById("cpfErro")

// Adicionar eventos
nomeInput.addEventListener('input', verificarDados);
cpfInput.addEventListener('input', verificarDados);
ufSelect.addEventListener('change', verificarDados);

// Lista de estados por sigla
const estados = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins"
};

//Fonte: - https://atitudereflexiva.wordpress.com/2021/05/05/entenda-como-e-gerado-o-numero-do-cpf/ 
//       - https://pt.wikipedia.org/wiki/Cadastro_de_Pessoas_Físicas#Número_de_inscrição
// Lista com os estados pertencentes a cada região fiscal
const regioesFiscais = {
    "0": ["RS"],
    "1": ["DF", "GO", "MS", "MT", "TO"],
    "2": ["AC", "AM", "AP", "PA", "RO", "RR"],
    "3": ["CE", "MA", "PI"],
    "4": ["AL", "PB", "PE", "RN"],
    "5": ["BA", "SE"],
    "6": ["MG"],
    "7": ["ES", "RJ"],
    "8": ["SP"],
    "9": ["PR", "SC"]
};

function verificarDados() {
    const listaDeErros = [
        "<br>" + "Letras não são permitidas, digite apenas números.",
        "<br>" + "O CPF deve ter 11 dígitos.",
        "<br>" + "CPF inválido: o seu estado de origem não é o mesmo do CPF.",
        "<br>" + "CPF inválido: o CPF não pode conter todos os números iguais.",
        "<br>" + "Digite um nome válido. (Ex: Maria dos Santos)",
        "<br>" + "Escolha um estado para continuar.",
        "<br>" + "O formato do CPF está incorreto.",
    ];

    // Função que reseta o layout das mensagens de erro
    function resetarMensagemErro(element) {
        // Verifica se o element é do tipo HTMLElement
        if (element instanceof HTMLElement) {
            element.style.display = 'none';
            element.innerHTML = "";
        }
    }

    // Fonte: https://pt.stackoverflow.com/questions/242948/validar-nome-e-sobrenome-com-expressão-regular
    //const regexNome = /(?=^.{2,60}$)^[A-ZÀÁÂĖÈÉÊÌÍÒÓÔÕÙÚÛÇ][a-zàáâãèéêìíóôõùúç]+(?:[ ](?:das?|dos?|de|e|[A-Z][a-z]+))*$/;
    const regexNome = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'][^\s]*\s*?)(?!.*[ ]$))+$/;

    // Verifica se o nome é inválido
    if (!regexNome.test(nomeInput.value)) {
        nomeErro.innerHTML = listaDeErros[4]; // "Digite um nome válido. (Ex: Maria dos Santos)"
        nomeErro.style.display = 'inline';
    } else {
        resetarMensagemErro(nomeErro); // Limpa mensagem de erro
    }

    // Verifica se nenhum estado foi escolhido
    if (ufSelect.value === null || ufSelect.value === "") {
        ufErro.innerHTML = listaDeErros[5]; // "Escolha um estado para continuar."
        ufErro.style.display = 'inline';

        // Reseta o CPF input
        cpfInput.disabled = true;
        resetarMensagemErro(cpfErro);
        return;
    }
    resetarMensagemErro(ufErro); // Limpa mensagem de erro

    // Torna o input do CPF vísivel
    cpfInput.disabled = false;
    cpfErro.style.color = "red";
    botaoButton.disabled = true;

    // Verifica se o input do CPF está vazio
    if (cpfInput.value === null || cpfInput.value === "") {
        resetarMensagemErro(cpfErro);
        return;
    }

    // Remove as letras do número
    let cpfNumerico = cpfInput.value.replace(/\D/g, '');

    const numIguais = /^(\d)\1{10}$/.test(cpfNumerico); // Ex: 111.111.111-11
    const contemLetra = /[a-zA-Z]/.test(cpfInput.value); // Ex: 11a.23d.233-22

    // Verifica se o input possui alguma letra
    if (contemLetra) {
        cpfErro.innerHTML = listaDeErros[0]; // "Letras não são permitidas, digite apenas números."
        cpfErro.style.display = 'inline';
    }
    // Verifica se todos os números são iguais 
    else if (numIguais) {
        cpfErro.innerHTML = listaDeErros[3]; // "CPF inválido: o CPF não pode conter todos os números iguais."
        cpfErro.style.display = 'inline';
    } else {
        resetarMensagemErro(cpfErro);
    
        // Verifica se o CPF tem 11 dígitos
        if (cpfNumerico.length === 11) {
            resetarMensagemErro(cpfErro);

            if (cpfNumerico.length >= 9) {
                // Obtem a lista dos estados da região fiscal correspondente ao 9 dígito do CPF
                const estadosRF = regioesFiscais[cpfNumerico[8]];  

                const ufOrigem = ufSelect.value;
                // Verifica se o estado de origem escolhido é diferente da região fiscal do CPF
                if (!estadosRF.includes(ufOrigem)) {
                    cpfErro.innerHTML = listaDeErros[2]; // "CPF inválido; O seu estado de origem não é o mesmo do CPF."
                    cpfErro.style.display = 'inline';
                } else {
                    resetarMensagemErro(cpfErro);

                    // Dados válido
                    cpfErro.innerHTML = "<br>" + "Dados válidos.";
                    cpfErro.style.color = "green";
                    cpfErro.style.display = 'inline';

                    // Habilita o botão
                    botaoButton.disabled = false;
                }
            }
        } else {
            cpfErro.innerHTML = listaDeErros[1]; // "O CPF deve ter 11 dígitos."
            cpfErro.style.display = 'inline';
        }
    }
}

// Fonte: http://www.receita.fazenda.gov.br/aplicacoes/atcta/cpf/funcoes.js
//        https://devarthur.com/blog/funcao-javascript-para-validar-cpf
/*
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
*/