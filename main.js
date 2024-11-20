// Obter os elementos
const nomeInput = document.getElementById("nome");
const nomePaiInput = document.getElementById("pai-nome");
const nomeMaeInput = document.getElementById("mae-nome");
const dataNascimentoInput = document.getElementById("data-nascimento");
const ufSelect = document.getElementById("uf");
const cidadeInput = document.getElementById("cidade");
const cpfInput = document.getElementById("cpf");
const botaoFrenteButton = document.getElementById("botao-frente");
const botaoTrasButton = document.getElementById("botao-tras");
const canvas = document.getElementById("canvas");
let nomeErro = document.getElementById("nomeErro");
let ufErro = document.getElementById("ufErro");
let dataErro = document.getElementById("dataErro");
let cpfErro = document.getElementById("cpfErro")

// Adicionar eventos
nomeInput.addEventListener('input', verificarDados);
nomePaiInput.addEventListener('input', verificarDados);
nomeMaeInput.addEventListener('input', verificarDados);
dataNascimentoInput.addEventListener('change', verificarDados);
cpfInput.addEventListener('input', verificarDados);
cidadeInput.addEventListener('input', verificarDados);
ufSelect.addEventListener('change', verificarDados);

botaoFrenteButton.addEventListener('click', function() { 
    if (verificarDados()) { 
        gerarIdentidade(1); 
    }
});

botaoTrasButton.addEventListener('click', function() { 
    if (verificarDados()) { 
        gerarIdentidade(2); 
    }
});

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

// Essa função basicamente verifica todos os dados digitados, e retorna true se todos forem verdadeiros.
function verificarDados() {
    const listaDeErros = [
        "<br>" + "Letras não são permitidas, digite apenas números.",
        "<br>" + "O CPF deve ter 11 dígitos.",
        "<br>" + "CPF inválido: o seu estado de origem não é o mesmo do CPF.",
        "<br>" + "CPF inválido: o CPF não pode conter todos os números iguais.",
        "<br>" + "Digite um nome válido. (Ex: Maria dos Santos)",
        "<br>" + "Escolha um estado para continuar.",
        "<br>" + "O nome não pode possuir mais que 60 caracteres.",
        "<br>" + "Digite a cidade para continuar.",
        "<br>" + "Escolha uma data para continuar.",
        "<br>" + "A cidade não pode possuir mais que 33 caracteres.",
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

    function verificarNome(nome, filiacao) {
        // Fonte: https://pt.stackoverflow.com/questions/242948/validar-nome-e-sobrenome-com-expressão-regular
        //const regexNome = /(?=^.{2,60}$)^[A-ZÀÁÂĖÈÉÊÌÍÒÓÔÕÙÚÛÇ][a-zàáâãèéêìíóôõùúç]+(?:[ ](?:das?|dos?|de|e|[A-Z][a-z]+))*$/;
        const regexNome = /^(?![ ])(?!.*[ ]{2})((?:e|da|do|das|dos|de|d'|D'|la|las|el|los)\s*?|(?:[A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð'][^\s]*\s*?)(?!.*[ ]$))+$/;

        let nomeValido = false;
        if (!regexNome.test(nome)) {
            if (filiacao === "pai" || filiacao === "mãe") {
                nomeErro.innerHTML = "<br>Digite um nome de " + filiacao + " válido. (Ex: Maria dos Santos)"; 
            } else {
                nomeErro.innerHTML = listaDeErros[4]; // "Digite um nome válido. (Ex: Maria dos Santos)"
            }
            nomeErro.style.display = 'inline';
        }
        else if (nome.length > 60) {
            nomeErro.innerHTML = listaDeErros[6]; // "O nome não pode possuir mais que 60 caracteres."
            nomeErro.style.display = 'inline';
        }
        else {
            resetarMensagemErro(nomeErro); // Limpa mensagem de erro
            nomeValido = true;
        }
        return nomeValido;
    }

    // Desabilita o botão temporariamente
    botaoFrenteButton.disabled = true;
    botaoTrasButton.disabled = true;

    // Verifica se o nome é inválido
    let nomeValido = verificarNome(nomeInput.value, "");
    if (!nomeValido) {
        // Reseta o CPF input
        cpfInput.disabled = true;
        resetarMensagemErro(cpfErro);
    } else {
         // Verifica se o nome é inválido
        var nomePaiValido = verificarNome(nomePaiInput.value, "pai");
        if (nomePaiValido) {
            // Verifica se o nome é inválido
            var nomeMaeValido = verificarNome(nomeMaeInput.value, "mãe");
        }
    }

    // Verifica se nenhuma data foi escolhida
    if (!dataNascimentoInput.value) {
        dataErro.innerHTML = listaDeErros[8]; // "Escolha uma data para continuar."
        dataErro.style.display = 'inline';
    
        //
        resetarMensagemErro(ufErro);
        
        // Reseta o CPF input
        cpfInput.disabled = true;
        resetarMensagemErro(cpfErro);
        return;
    } else {
        resetarMensagemErro(dataErro);
        // Verifica se nenhum estado foi escolhido
        if (!ufSelect.value) {
            ufErro.innerHTML = listaDeErros[5]; // "Escolha um estado para continuar."
            ufErro.style.display = 'inline';

            // Desabilita a seleção de cidades
            cidadeInput.disabled = true;

            // Reseta o CPF input
            cpfInput.disabled = true;
            resetarMensagemErro(cpfErro);
            return false;
        }
        resetarMensagemErro(ufErro);
    }

    // Grande gambiarra, importante é estar funcionando kkkk
    if (!nomeValido || !nomePaiValido || !nomeMaeValido) {
        // Desabilita a seleção de cidades
        cidadeInput.disabled = true;

        // Reseta o CPF input
        cpfInput.disabled = true;
        resetarMensagemErro(cpfErro);
        return false;
    }

    // Desabilita a seleção de cidades
    cidadeInput.disabled = false;

    if (!cidadeInput.value) {
        ufErro.innerHTML = listaDeErros[7]; // "Digite a cidade para continuar."
        ufErro.style.display = 'inline';

        // Reseta o CPF input
        cpfInput.disabled = true;
        resetarMensagemErro(cpfErro);
        return;
    }
    else {
        if (cidadeInput.value.length > 33) {
            ufErro.innerHTML = listaDeErros[9]; // "A cidade não pode possuir mais que 33 caracteres."
            ufErro.style.display = 'inline';

            // Reseta o CPF input
            cpfInput.disabled = true;
            resetarMensagemErro(cpfErro);
            return;
        }
        resetarMensagemErro(ufErro);
    }

    // Torna o input do CPF vísivel
    cpfInput.disabled = false;
    cpfErro.style.color = "red";

    // Verifica se o input do CPF está vazio
    if (!cpfInput.value) {
        resetarMensagemErro(cpfErro);
        return false;
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
                // Verifica se o estado de origem escolhido é difereente da região fiscal do CPF
                if (!estadosRF.includes(ufOrigem)) {
                    cpfErro.innerHTML = listaDeErros[2]; // "CPF inválido; O seu estado de origem não é o mesmo do CPF."
                    cpfErro.style.display = 'inline';
                } else {
                    resetarMensagemErro(cpfErro);

                    // Dados válido
                    cpfErro.innerHTML = "<br>" + "Dados válidos.";
                    cpfErro.style.color = "green";
                    cpfErro.style.display = 'inline';

                    // Habilita os botões
                    botaoFrenteButton.disabled = false;
                    botaoTrasButton.disabled = false;
                    return true;
                }
            }
        } else {
            cpfErro.innerHTML = listaDeErros[1]; // "O CPF deve ter 11 dígitos."
            cpfErro.style.display = 'inline';
        }
    }

    // Dados são inválidos, então desabilite os botões temporariamente
    botaoFrenteButton.disabled = true;
    botaoTrasButton.disabled = true;
    return false;
}

/*
        Posição:
            1 - Frente
            2 - Trás
*/
let ultimaPosicao = 0;
function gerarIdentidade(posicao) {
    const ctx = canvas.getContext('2d');
    const imagemFundo = new Image();
    const imagemRosto = new Image();

    // Lista de fontes
    const fontes = [
        ['Southampton', '42px'],
        ['Harris-Signature', '50px'],
        ['Gloriant-Signature', '43px'],
        ['Darcey-Oliver', '53px']
    ];

    if (ultimaPosicao !== posicao) {
        // Apaga o conteúdo anterior do canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Frente
    if (posicao == 1) { 
        imagemFundo.src = "assets/img/rg-frente.png";

        imagemFundo.onload = function() {
            // Gera uma array com indice aleatório
            let [nomeFonte, fontSize] = shuffleArray([...fontes])[0];

            // Carrega a fonte escolhida
            var fontFace = new FontFace('fonteAssinatura', `url(assets/fonts/${nomeFonte}.ttf)`);
            fontFace.load().then(function(font) 
            {
                document.fonts.add(font);

                // Renderizar imagem de fundo (foto do RG)
                ctx.drawImage(imagemFundo, 0, 0, 800, 500);

                ctx.font = `${fontSize} fonteAssinatura`;

                // Cria o texto da assinatura sobre a imagem
                ctx.fillText(nomeInput.value, 78, 
                    (nomeFonte === 'Harris-Signature' ? 404 : 
                    (nomeFonte === 'Darcey-Oliver' ? 399 : 400)),
                    619); // Largura maxima do texto (para caber dentro do campo de assinatura) 

                // Imagem rosto     
                ctx.save();
                ctx.translate(190 + (canvas.width / 2), (canvas.height / 2) - 2);
        
                // Rotaciona em -90 graus (anti-horário)
                ctx.rotate(Math.PI / 2);

                // Mostra a imagem
                //imagemRosto.onload = function() {
                    ctx.drawImage(imagemRosto, -imagemRosto.width / 2, -imagemRosto.height/2, 200, 310);
                //}

                ctx.restore();
            });    
        };
    } 
    // Trás
    else if(posicao == 2) {
        imagemFundo.src = "assets/img/rg-tras.png";

        imagemFundo.onload = function() {
            var fontFace = new FontFace('fonteCourier', 'url(assets/fonts/Courier-New.ttf)');
            fontFace.load().then(function(font) 
            {
                document.fonts.add(font);

                ctx.drawImage(imagemFundo, 0, 0, 800, 500);

                ctx.font = '21px fonteCourier';

                // RG
                const rg = gerarRG();
                ctx.fillText(rg, 138, 82)

                // Nome
                const nomeMaiusculo = nomeInput.value.toUpperCase();
                ctx.fillText(nomeMaiusculo, 60, 137, 686);

                // Data de emissão
                const dataBrasilia = new Intl.DateTimeFormat('pt-BR', {
                    timeZone: 'America/Sao_Paulo',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }).format(new Date());
                ctx.fillText(dataBrasilia, 549, 79)

                // Filiação
                const nomePaiMaiusculo = nomePaiInput.value.toUpperCase();
                ctx.fillText(nomePaiMaiusculo, 60, 182);

                const nomeMaeMaiusculo = nomeMaeInput.value.toUpperCase();
                ctx.fillText(nomeMaeMaiusculo, 60, 203);

                // Naturalidade
                const natural = cidadeInput.value.toUpperCase() + " - " + ufSelect.value;
                ctx.fillText(natural, 61, 274);

                // Documento origem
                // As informações estão constantes, creio que não compense fazer um gerador para essas informações...
                const origem = "CERT.NAS.2876,FLS.287,LIV.B-14,2.OF.,";
                ctx.fillText(origem, 61, 342);
                ctx.fillText(natural, 61, 365);

                // Data de nascimento
                const dataNascimento = new Intl.DateTimeFormat('pt-BR', 
                    {timeZone: 'UTC'}).format(new Date(dataNascimentoInput.value));

                ctx.fillText(dataNascimento, 563, 277);

                //ctx.save();

                // CPF
                //ctx.font = 'bold 21px fonteCourier';

                const cpfString = cpfInput.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                ctx.fillText(cpfString, 60, 412);

                //ctx.restore();
            });
        };
    }

    // Implementar: https://thispersondoesnotexist.com
    imagemRosto.src = "assets/img/sem-rosto.jpg";
    ultimaPosicao = posicao;

    /* Gerar foto */
    /* Fonte: https://this-person-does-not-exist.com
       P.S: Foi a única API gratuíta para geração de imagens 
        que encontrei, não é a melhor, mas quebra um galho.

        Ela retorna esses dados (json):

        {    
            "generated": "true",
            "scheme": "http",
            "src": "/img/avatar-xx.jpg",
            "name": "avatar-xx.jpg"
        } 
    */
   /*
   let timeMS = Date.now();
   let genero = "female";
   let idade = "12-18";
   let etnia = "all";

   // O site tem uma proibição CORS, pesquisando eu vi que temos que utilizar um CORS Proxy para
   //   contornar essa situação.
   // Essa é uma solução temporária, tudo depende de quanto tempo o site do proxy estará online.
   // Agradecimentos: https://corsproxy.io/
   const apiUrl = 'https://corsproxy.io/?' + `https://this-person-does-not-exist.com/new?time=${timeMS}&gender=${genero}&age=${idade}&etnic=${etnia}`;

   var imageSrc = '';
   // Faz a requisição GET
   fetch(apiUrl)
       .then(response => {
           cpfErro.innerHTML = "<br>" + response; 
           cpfErro.style.display = 'inline';
           if (response.ok) {
               return response.json();
           }
       })
       .then(data => {
           // Pega o url da imagem
           imageSrc = data.src;

           cpfErro.innerHTML = "<br>" + imageSrc;
           cpfErro.style.display = 'inline';
       })
       .catch(error => {
           //cpfErro.innerHTML = "<br>" + error;
           cpfErro.style.display = 'inline';
       });

    //
    imagemRosto.src = 'https://corsproxy.io/?' +'https://this-person-does-not-exist.com/' + imageSrc;
    */
}


/* Fonte: 
        - https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
        - https://stackoverflow.com/a/12646864 

    - Gera uma array aleatória, sem repetição.
*/
function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* Fonte:
        https://github.com/yyyyyyyan/cidadaobr/blob/master/cidadaobr/rg.py

*/
function gerarRG() {
    let numeros = '';
    for (let n = 0; n < 8; n++) {
        numeros += Math.floor(Math.random() * 10).toString();
    }

    let somaProdutos = 0;
    for(let i = 0; i < numeros.length; i++) {
        somaProdutos += parseInt(numeros[i] * (i + 2));
    }

    if (somaProdutos % 11 > 2) {
        numeros += (11 - (somaProdutos % 11)).toString();
    } else {
        numeros += '0';
    }
    return numeros.replace(/^(\d{2})(\d{3})(\d{3})(\d{1})$/, '$1.$2.$3-$4');
}