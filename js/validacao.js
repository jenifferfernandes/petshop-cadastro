// ============================================================
// FUNÇÃO PRINCIPAL DE VALIDAÇÃO
// ============================================================

/*
 * A função "valida" recebe um elemento <input> do formulário.
 *
 * Exemplo:
 * valida(input)
 *
 * O parâmetro "input" representa o campo que queremos validar.
 */
export function valida(input) {

    /*
     * dataset permite acessar os atributos personalizados
     * que começam com "data-" no HTML.
     *
     * Exemplo no HTML:
     *
     * <input data-tipo="email">
     *
     * Nesse caso:
     * input.dataset.tipo
     *
     * vai retornar:
     * "email"
     */
    const tipoDeInput = input.dataset.tipo


    /*
     * Aqui verificamos se existe um validador personalizado
     * para esse tipo de campo.
     *
     * Por exemplo:
     *
     * data-tipo="cpf"
     *
     * fará o código procurar:
     *
     * validadores.cpf
     *
     * Se existir, a função correspondente será executada.
     */
    if (validadores[tipoDeInput]) {

        /*
         * Executa o validador personalizado.
         *
         * O input é enviado como argumento para a função.
         *
         * Por exemplo:
         *
         * validadores.cpf(input)
         *
         * chama:
         *
         * validaCPF(input)
         */
        validadores[tipoDeInput](input)
    }


    /*
     * "input.validity.valid" faz parte da API de validação
     * dos formulários do navegador.
     *
     * Ele retorna:
     *
     * true  -> campo válido
     * false -> campo inválido
     *
     * O navegador verifica coisas como:
     *
     * - required
     * - type
     * - pattern
     * - min
     * - max
     * - setCustomValidity()
     */
    if (input.validity.valid) {

        /*
         * Se o campo estiver válido, removemos a classe CSS
         * responsável por indicar que o campo possui erro.
         *
         * parentElement representa o elemento pai do input.
         *
         * Exemplo:
         *
         * <div class="input-container">
         *     <input>
         * </div>
         *
         * parentElement seria o <div>.
         */
        input.parentElement.classList.remove(
            'input-container--invalido'
        )


        /*
         * Procura dentro do elemento pai pelo elemento
         * responsável por mostrar a mensagem de erro.
         *
         * querySelector() procura um elemento usando
         * um seletor CSS.
         *
         * Depois usamos innerHTML = ''
         * para apagar a mensagem de erro.
         */
        input.parentElement
            .querySelector('.input-mensagem-erro')
            .innerHTML = ''

    } else {

        /*
         * Se o campo estiver inválido, adicionamos uma classe
         * CSS para indicar visualmente o erro.
         */
        input.parentElement.classList.add(
            'input-container--invalido'
        )


        /*
         * Aqui colocamos a mensagem de erro dentro do elemento
         * que possui a classe:
         *
         * .input-mensagem-erro
         *
         * A função mostraMensagemDeErro() descobre qual
         * mensagem deve ser apresentada.
         */
        input.parentElement
            .querySelector('.input-mensagem-erro')
            .innerHTML = mostraMensagemDeErro(
                tipoDeInput,
                input
            )
    }
}


// ============================================================
// TIPOS DE ERRO DISPONIBILIZADOS PELO NAVEGADOR
// ============================================================

/*
 * Array contendo os principais tipos de erro que estamos
 * interessados em verificar.
 *
 * O navegador disponibiliza essas propriedades através
 * de input.validity.
 *
 * Exemplos:
 *
 * input.validity.valueMissing
 * input.validity.typeMismatch
 * input.validity.patternMismatch
 * input.validity.customError
 */
const tiposDeErro = [

    // Campo obrigatório não foi preenchido.
    'valueMissing',

    // O valor não corresponde ao tipo esperado.
    // Exemplo: um e-mail inválido.
    'typeMismatch',

    // O valor não corresponde ao pattern definido no HTML.
    'patternMismatch',

    // Erro criado manualmente usando setCustomValidity().
    'customError'
]


// ============================================================
// MENSAGENS DE ERRO
// ============================================================

/*
 * Este objeto guarda todas as mensagens que poderão
 * aparecer para o usuário.
 *
 * A estrutura é:
 *
 * tipo do campo -> tipo do erro -> mensagem
 *
 * Exemplo:
 *
 * mensagensDeErro.email.typeMismatch
 *
 * retorna:
 *
 * "O email digitado não é válido."
 */
const mensagensDeErro = {

    // --------------------------------------------------------
    // CAMPO NOME
    // --------------------------------------------------------

    nome: {

        // Aparece quando o campo é obrigatório e está vazio.
        valueMissing:
            'O campo de nome não pode estar vazio.'
    },


    // --------------------------------------------------------
    // CAMPO EMAIL
    // --------------------------------------------------------

    email: {

        // Mensagem para campo vazio.
        valueMissing:
            'O campo de email não pode estar vazio.',

        // Mensagem para e-mail em formato inválido.
        typeMismatch:
            'O email digitado não é válido.'
    },


    // --------------------------------------------------------
    // CAMPO SENHA
    // --------------------------------------------------------

    senha: {

        // Mensagem para senha vazia.
        valueMissing:
            'O campo de senha não pode estar vazio.',

        /*
         * Mensagem quando a senha não respeita o pattern
         * definido no HTML.
         */
        patternMismatch:
            'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },


    // --------------------------------------------------------
    // CAMPO DATA DE NASCIMENTO
    // --------------------------------------------------------

    dataNascimento: {

        // Mensagem para data não preenchida.
        valueMissing:
            'O campo de data de nascimento não pode estar vazio.',

        /*
         * customError será utilizado porque a validação
         * de idade será feita manualmente pelo JavaScript.
         */
        customError:
            'Você deve ser maior que 18 anos para se cadastrar.'
    },


    // --------------------------------------------------------
    // CAMPO CPF
    // --------------------------------------------------------

    cpf: {

        // Mensagem para CPF vazio.
        valueMissing:
            'O campo de CPF não pode estar vazio.',

        /*
         * customError será utilizado quando o cálculo
         * do CPF indicar que ele é inválido.
         */
        customError:
            'O CPF digitado não é válido.'
    },


    // --------------------------------------------------------
    // CAMPO CEP
    // --------------------------------------------------------

    cep: {

        // Mensagem quando o CEP não foi preenchido.
        valueMissing:
            'O campo de CEP não pode estar vazio.',

        // Mensagem quando o CEP não respeita o pattern do HTML.
        patternMismatch:
            'O CEP digitado não é valido.',

        /*
         * customError será usado quando não for possível
         * encontrar o CEP na API do ViaCEP.
         */
        customError:
            'Não foi possível buscar o CEP'
    },


    // --------------------------------------------------------
    // CAMPO LOGRADOURO
    // --------------------------------------------------------

    logradouro: {

        // Mensagem caso o campo esteja vazio.
        valueMissing:
            'O campo de logradouro não pode estar vazio.'
    },


    // --------------------------------------------------------
    // CAMPO CIDADE
    // --------------------------------------------------------

    cidade: {

        // Mensagem caso o campo esteja vazio.
        valueMissing:
            'O campo de cidade não pode estar vazio.'
    },


    // --------------------------------------------------------
    // CAMPO ESTADO
    // --------------------------------------------------------

    estado: {

        // Mensagem caso o campo esteja vazio.
        valueMissing:
            'O campo de estado não pode estar vazio.'
    },


    // --------------------------------------------------------
    // CAMPO PREÇO
    // --------------------------------------------------------

    preco: {

        // Mensagem caso o campo esteja vazio.
        valueMissing:
            'O campo de preço não pode estar vazio.'
    }
}


// ============================================================
// VALIDADORES PERSONALIZADOS
// ============================================================

/*
 * Este objeto funciona como uma "central de validadores".
 *
 * A chave é o valor encontrado em:
 *
 * input.dataset.tipo
 *
 * E o valor é a função que deverá ser executada.
 *
 * Exemplo:
 *
 * <input data-tipo="cpf">
 *
 * então:
 *
 * tipoDeInput = "cpf"
 *
 * e o código executará:
 *
 * validadores.cpf(input)
 *
 * que, por sua vez, chama:
 *
 * validaCPF(input)
 */
const validadores = {

    /*
     * Quando o tipo for "dataNascimento",
     * executamos a função validaDataNascimento().
     *
     * "input =>" é uma arrow function.
     */
    dataNascimento:
        input => validaDataNascimento(input),


    /*
     * Quando o tipo for "cpf",
     * executamos validaCPF().
     */
    cpf:
        input => validaCPF(input),


    /*
     * Quando o tipo for "cep",
     * executamos recuperarCEP().
     */
    cep:
        input => recuperarCEP(input)
}


// ============================================================
// DESCOBRIR A MENSAGEM DE ERRO
// ============================================================

/*
 * Essa função recebe:
 *
 * tipoDeInput -> qual campo está sendo validado
 * input       -> o elemento HTML
 *
 * E retorna a mensagem de erro correta.
 */
function mostraMensagemDeErro(tipoDeInput, input) {

    /*
     * Começamos com uma string vazia.
     *
     * Se encontrarmos um erro, essa variável receberá
     * a mensagem correspondente.
     */
    let mensagem = ''


    /*
     * forEach percorre cada item do array tiposDeErro.
     *
     * A variável "erro" representa cada item do array.
     *
     * Por exemplo:
     *
     * primeira volta:
     * erro = "valueMissing"
     *
     * segunda:
     * erro = "typeMismatch"
     *
     * etc.
     */
    tiposDeErro.forEach(erro => {

        /*
         * Verificamos se esse tipo de erro aconteceu.
         *
         * Por exemplo:
         *
         * input.validity.valueMissing
         *
         * pode ser true ou false.
         */
        if (input.validity[erro]) {

            /*
             * Aqui buscamos a mensagem correspondente.
             *
             * Exemplo:
             *
             * tipoDeInput = "email"
             * erro = "typeMismatch"
             *
             * Então:
             *
             * mensagensDeErro.email.typeMismatch
             *
             * será retornado.
             */
            mensagem =
                mensagensDeErro[tipoDeInput][erro]
        }
    })


    /*
     * Retorna a mensagem encontrada.
     */
    return mensagem
}


// ============================================================
// VALIDAÇÃO DA DATA DE NASCIMENTO
// ============================================================

/*
 * Essa função verifica se a pessoa possui pelo menos
 * 18 anos.
 *
 * O parâmetro "input" é o campo de data do formulário.
 */
function validaDataNascimento(input) {

    /*
     * new Date() transforma o valor recebido em uma
     * representação de data do JavaScript.
     *
     * input.value contém a data digitada pelo usuário.
     */
    const dataRecebida = new Date(input.value)


    /*
     * Começamos sem nenhuma mensagem de erro.
     */
    let mensagem = ''


    /*
     * Primeiro verificamos se o campo não está vazio.
     *
     * input.value !== ''
     *
     * significa:
     *
     * "o campo possui algum valor?"
     *
     * Depois verificamos:
     *
     * !maiorQue18(dataRecebida)
     *
     * O "!" significa NOT.
     *
     * Portanto:
     *
     * "a pessoa NÃO é maior de 18 anos?"
     */
    if (
        input.value !== '' &&
        !maiorQue18(dataRecebida)
    ) {

        /*
         * Se a pessoa não tiver 18 anos,
         * criamos uma mensagem de erro.
         */
        mensagem =
            'Você deve ser maior que 18 anos para se cadastrar.'
    }


    /*
     * setCustomValidity() permite criar uma validação
     * personalizada.
     *
     * Se receber uma string vazia:
     *
     * input.setCustomValidity('')
     *
     * significa que não existe erro personalizado.
     *
     * Se receber uma mensagem:
     *
     * input.setCustomValidity('mensagem')
     *
     * o navegador considera o campo inválido.
     */
    input.setCustomValidity(mensagem)
}


// ============================================================
// VERIFICAR SE A PESSOA É MAIOR DE 18 ANOS
// ============================================================

/*
 * Recebe uma data de nascimento e retorna:
 *
 * true  -> se a pessoa possui 18 anos ou mais
 * false -> se possui menos de 18 anos
 */
function maiorQue18(data) {

    /*
     * new Date() sem parâmetros representa a data e hora atuais.
     */
    const dataAtual = new Date()


    /*
     * Criamos uma nova data adicionando 18 anos
     * à data de nascimento.
     *
     * Exemplo:
     *
     * nascimento = 10/08/2000
     *
     * dataMais18 = 10/08/2018
     */
    const dataMais18 = new Date(

        /*
         * getUTCFullYear() retorna o ano da data.
         *
         * Somamos 18 anos.
         */
        data.getUTCFullYear() + 18,

        /*
         * getUTCMonth() retorna o mês.
         *
         * IMPORTANTE:
         * no JavaScript, janeiro é 0 e dezembro é 11.
         */
        data.getUTCMonth(),

        /*
         * getUTCDate() retorna o dia do mês.
         */
        data.getUTCDate()
    )


    /*
     * Comparamos a data em que a pessoa completa 18 anos
     * com a data atual.
     *
     * Se dataMais18 <= dataAtual:
     *
     * significa que a pessoa já completou 18 anos.
     *
     * O resultado será true ou false.
     */
    return dataMais18 <= dataAtual
}


// ============================================================
// VALIDAÇÃO DO CPF
// ============================================================

/*
 * Essa função recebe o elemento <input> do CPF.
 *
 * Ela faz a ligação entre:
 *
 * input do formulário
 *
 * e
 *
 * função validarCPF()
 *
 * que é responsável pelo cálculo matemático do CPF.
 */
function validaCPF(input) {

    /*
     * Começamos sem nenhuma mensagem de erro.
     */
    let mensagem = ''


    /*
     * Primeiro verificamos se o usuário digitou alguma coisa.
     *
     * trim() remove espaços do começo e do final.
     *
     * Exemplo:
     *
     * "   12345678909   "
     *
     * vira:
     *
     * "12345678909"
     *
     * Assim evitamos validar CPF vazio.
     */
    if (
        input.value.trim() !== '' &&

        /*
         * Chamamos a função que realmente verifica
         * se o CPF é matematicamente válido.
         *
         * O "!" significa:
         *
         * "se o CPF NÃO for válido..."
         */
        !validarCPF(input.value)
    ) {

        /*
         * CPF inválido.
         */
        mensagem = 'O CPF digitado não é válido.'
    }


    /*
     * Informa ao navegador se existe ou não
     * um erro personalizado.
     */
    input.setCustomValidity(mensagem)
}


// ============================================================
// CALCULAR DÍGITO DO CPF
// ============================================================

/*
 * Essa função calcula um dos dígitos verificadores do CPF.
 *
 * Ela pode receber:
 *
 * 9 números -> calcula o primeiro dígito
 *
 * 10 números -> calcula o segundo dígito
 */
function calcularDigito(cpfParcial) {

    /*
     * Variável usada para acumular o resultado das
     * multiplicações.
     *
     * Começa em zero.
     */
    let soma = 0


    /*
     * O peso inicial depende do tamanho do CPF parcial.
     *
     * Se temos 9 números:
     *
     * 9 + 1 = 10
     *
     * Então os pesos começam em 10.
     */
    let peso = cpfParcial.length + 1


    /*
     * for percorre todos os números do CPF parcial.
     *
     * i começa em 0.
     *
     * i < cpfParcial.length
     * significa que o loop continua enquanto
     * i for menor que a quantidade de números.
     */
    for (
        let i = 0;
        i < cpfParcial.length;
        i++
    ) {

        /*
         * cpfParcial[i] pega um caractere específico.
         *
         * Number() transforma esse caractere em número.
         *
         * Exemplo:
         *
         * "5" -> 5
         */
        const numero = Number(cpfParcial[i])


        /*
         * Multiplicamos o número pelo peso atual
         * e adicionamos o resultado à soma.
         */
        soma += numero * peso


        /*
         * Diminuímos o peso em 1 para a próxima posição.
         */
        peso--
    }


    /*
     * Calculamos o resto da divisão da soma por 11.
     *
     * O operador % representa o resto da divisão.
     *
     * Exemplo:
     *
     * 20 % 11 = 9
     */
    const resto = soma % 11


    /*
     * O cálculo do dígito usa 11 menos o resto.
     */
    const resultado = 11 - resto


    /*
     * Se o resultado for 10 ou 11,
     * o dígito verificador será 0.
     *
     * Caso contrário, usamos o próprio resultado.
     *
     * O operador ternário funciona assim:
     *
     * condição ? valorSeVerdadeiro : valorSeFalso
     */
    return resultado >= 10 ? 0 : resultado
}


// ============================================================
// VALIDAR CPF COMPLETO
// ============================================================

/*
 * Recebe o CPF como texto.
 *
 * Retorna:
 *
 * true  -> CPF válido
 * false -> CPF inválido
 */
function validarCPF(cpf) {

    /*
     * replace() substitui partes de um texto.
     *
     * /\D/g é uma expressão regular que significa:
     *
     * "encontre tudo que NÃO seja número".
     *
     * Portanto, pontos, traços, espaços etc. são removidos.
     *
     * Exemplo:
     *
     * "123.456.789-09"
     *
     * vira:
     *
     * "12345678909"
     */
    const cpfNumerico = cpf.replace(/\D/g, '')


    /*
     * Um CPF precisa possuir exatamente 11 números.
     *
     * Se tiver quantidade diferente, retornamos false.
     */
    if (cpfNumerico.length !== 11) {
        return false
    }


    /*
     * Essa expressão regular verifica se todos os 11 números
     * são iguais.
     *
     * Exemplos inválidos:
     *
     * 11111111111
     * 22222222222
     * 33333333333
     *
     * etc.
     *
     * ^       -> início do texto
     * (\d)    -> captura um número
     * \1{10}  -> repete o mesmo número mais 10 vezes
     * $       -> final do texto
     */
    if (/^(\d)\1{10}$/.test(cpfNumerico)) {
        return false
    }


    /*
     * slice(0, 9) pega os 9 primeiros caracteres.
     *
     * O CPF possui:
     *
     * 9 números principais
     * +
     * 2 dígitos verificadores
     */
    const baseCPF = cpfNumerico.slice(0, 9)


    /*
     * Calculamos o primeiro dígito verificador.
     */
    const primeiroDigito = calcularDigito(baseCPF)


    /*
     * Agora calculamos o segundo dígito.
     *
     * Para isso, utilizamos:
     *
     * os 9 números originais
     * +
     * o primeiro dígito calculado
     */
    const segundoDigito = calcularDigito(
        baseCPF + primeiroDigito
    )


    /*
     * Montamos o CPF que deveria ser válido.
     *
     * Exemplo:
     *
     * baseCPF:
     * 123456789
     *
     * primeiroDigito:
     * 0
     *
     * segundoDigito:
     * 9
     *
     * resultado:
     * 12345678909
     */
    const cpfCalculado =
        baseCPF +
        primeiroDigito +
        segundoDigito


    /*
     * Comparamos:
     *
     * CPF calculado
     *
     * com
     *
     * CPF informado pelo usuário.
     *
     * Se forem iguais:
     *
     * true
     *
     * Caso contrário:
     *
     * false
     */
    return cpfCalculado === cpfNumerico
}


// ============================================================
// BUSCAR CEP NA API DO VIACEP
// ============================================================

/*
 * Essa função recebe o input do CEP.
 *
 * Ela:
 *
 * 1. Pega o CEP digitado.
 * 2. Remove caracteres que não são números.
 * 3. Monta a URL da API.
 * 4. Faz uma requisição usando fetch().
 * 5. Recebe os dados do endereço.
 * 6. Preenche os campos de logradouro, cidade e estado.
 */
function recuperarCEP(input) {

    /*
     * Remove tudo que não for número.
     *
     * Exemplo:
     *
     * "01310-100"
     *
     * vira:
     *
     * "01310100"
     */
    const cep = input.value.replace(/\D/g, '')


    /*
     * Criamos a URL que será utilizada para consultar
     * o CEP na API do ViaCEP.
     *
     * O valor do CEP é colocado dentro da URL usando
     * template literals:
     *
     * `${cep}`
     */
    const url =
        `https://viacep.com.br/ws/${cep}/json/`


    /*
     * Objeto contendo as configurações da requisição.
     *
     * method: GET
     *
     * significa que estamos solicitando informações.
     */
    const options = {

        // Tipo da requisição HTTP.
        method: 'GET',

        /*
         * Permite que o navegador faça uma requisição
         * para outro domínio, respeitando as regras de CORS.
         */
        mode: 'cors',

        /*
         * Informa o formato esperado para o conteúdo.
         */
        headers: {
            'content-type':
                'application/json;charset=utf-8'
        }
    }


    /*
     * Antes de chamar a API, verificamos duas coisas:
     *
     * 1. O CEP não possui erro de pattern.
     *
     * 2. O CEP não está vazio.
     *
     * O operador && significa "E".
     *
     * Portanto, as duas condições precisam ser verdadeiras.
     */
    if (
        !input.validity.patternMismatch &&
        !input.validity.valueMissing
    ) {

        /*
         * fetch() faz uma requisição para uma API.
         *
         * Aqui estamos pedindo os dados do CEP.
         *
         * fetch() retorna uma Promise.
         *
         * Promise representa uma operação que será concluída
         * no futuro.
         */
        fetch(url, options)

            /*
             * Quando a resposta chegar, usamos response.json()
             * para transformar a resposta em um objeto JavaScript.
             */
            .then(
                response => response.json()
            )

            /*
             * Depois que o JSON for convertido em objeto,
             * recebemos os dados dentro da variável "data".
             */
            .then(

                data => {

                    /*
                     * A API do ViaCEP pode retornar:
                     *
                     * {
                     *     erro: true
                     * }
                     *
                     * quando o CEP não existe.
                     *
                     * Então verificamos se data.erro existe.
                     */
                    if (data.erro) {

                        /*
                         * Se o CEP não foi encontrado,
                         * criamos um erro personalizado.
                         */
                        input.setCustomValidity(
                            'Não foi possível buscar o CEP'
                        )

                        /*
                         * return interrompe a execução dessa função.
                         */
                        return
                    }


                    /*
                     * Se chegamos aqui, significa que o CEP
                     * foi encontrado.
                     *
                     * Uma string vazia informa ao navegador
                     * que não existe erro personalizado.
                     */
                    input.setCustomValidity('')


                    /*
                     * Enviamos os dados encontrados para a função
                     * que preencherá os campos automaticamente.
                     */
                    preencheCamposComCEP(data)


                    /*
                     * Finaliza a execução.
                     */
                    return
                }
            )
    }
}


// ============================================================
// PREENCHER OS CAMPOS COM OS DADOS DO CEP
// ============================================================

/*
 * Essa função recebe os dados retornados pela API do ViaCEP.
 *
 * Exemplo de dados recebidos:
 *
 * {
 *     logradouro: "Avenida Paulista",
 *     localidade: "São Paulo",
 *     uf: "SP"
 * }
 */
function preencheCamposComCEP(data) {

    /*
     * document representa a página HTML inteira.
     *
     * querySelector() procura um elemento usando
     * um seletor CSS.
     *
     * Aqui procuramos o input que possui:
     *
     * data-tipo="logradouro"
     */
    const logradouro =
        document.querySelector(
            '[data-tipo="logradouro"]'
        )


    /*
     * Procuramos o campo de cidade.
     */
    const cidade =
        document.querySelector(
            '[data-tipo="cidade"]'
        )


    /*
     * Procuramos o campo de estado.
     */
    const estado =
        document.querySelector(
            '[data-tipo="estado"]'
        )


    /*
     * Agora pegamos os dados recebidos da API
     * e colocamos dentro dos inputs.
     *
     * data.logradouro contém o nome da rua.
     */
    logradouro.value = data.logradouro


    /*
     * data.localidade contém o nome da cidade.
     */
    cidade.value = data.localidade


    /*
     * data.uf contém a sigla do estado.
     *
     * Exemplo:
     *
     * SP
     * RJ
     * MG
     */
    estado.value = data.uf
}
 


