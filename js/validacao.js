
// FUNÇÃO PRINCIPAL DE VALIDAÇÃO


export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    // Executa um validador personalizado, se existir para esse tipo de campo
    if (validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if (input.validity.valid) {
        input.parentElement.classList.remove('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else {
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML =
            mostraMensagemDeErro(tipoDeInput, input)
    }
}



// TIPOS DE ERRO DISPONIBILIZADOS PELO NAVEGADOR


const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]



// MENSAGENS DE ERRO


const mensagensDeErro = {

    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.'
    },

    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },

    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch:
            'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.'
    },

    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        // customError é usado pois a validação de idade é manual (ver validaDataNascimento)
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },

    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        // customError é usado quando o cálculo do CPF aponta que ele é inválido
        customError: 'O CPF digitado não é válido.'
    },

    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é valido.',
        // customError é usado quando o CEP não é encontrado na API do ViaCEP
        customError: 'Não foi possível buscar o CEP'
    },

    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },

    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },

    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    },

    preco: {
        valueMissing: 'O campo de preço não pode estar vazio.'
    }
}



// VALIDADORES PERSONALIZADOS


// Mapeia data-tipo do input para a função de validação correspondente
const validadores = {
    dataNascimento: input => validaDataNascimento(input),
    cpf: input => validaCPF(input),
    cep: input => recuperarCEP(input)
}



// DESCOBRIR A MENSAGEM DE ERRO


function mostraMensagemDeErro(tipoDeInput, input) {
    let mensagem = ''

    tiposDeErro.forEach(erro => {
        if (input.validity[erro]) {
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}



// VALIDAÇÃO DA DATA DE NASCIMENTO


function validaDataNascimento(input) {
    const dataRecebida = new Date(input.value)
    let mensagem = ''

    if (input.value !== '' && !maiorQue18(dataRecebida)) {
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar.'
    }

    // Uma string vazia limpa o erro personalizado; uma mensagem invalida o campo
    input.setCustomValidity(mensagem)
}



// VERIFICAR SE A PESSOA É MAIOR DE 18 ANOS


function maiorQue18(data) {
    const dataAtual = new Date()

    const dataMais18 = new Date(
        data.getUTCFullYear() + 18,
        data.getUTCMonth(), // janeiro é 0, dezembro é 11
        data.getUTCDate()
    )

    return dataMais18 <= dataAtual
}



// VALIDAÇÃO DO CPF


function validaCPF(input) {
    let mensagem = ''

    if (input.value.trim() !== '' && !validarCPF(input.value)) {
        mensagem = 'O CPF digitado não é válido.'
    }

    input.setCustomValidity(mensagem)
}



// CALCULAR DÍGITO DO CPF


// Recebe 9 números (calcula o 1º dígito) ou 10 números (calcula o 2º dígito)
function calcularDigito(cpfParcial) {
    let soma = 0
    let peso = cpfParcial.length + 1

    for (let i = 0; i < cpfParcial.length; i++) {
        const numero = Number(cpfParcial[i])
        soma += numero * peso
        peso--
    }

    const resto = soma % 11
    const resultado = 11 - resto

    // Se o resultado for 10 ou 11, o dígito verificador é 0
    return resultado >= 10 ? 0 : resultado
}



// VALIDAR CPF COMPLETO


function validarCPF(cpf) {
    const cpfNumerico = cpf.replace(/\D/g, '')

    if (cpfNumerico.length !== 11) {
        return false
    }

    // Rejeita CPFs com todos os dígitos iguais (111.111.111-11, etc.)
    if (/^(\d)\1{10}$/.test(cpfNumerico)) {
        return false
    }

    const baseCPF = cpfNumerico.slice(0, 9)
    const primeiroDigito = calcularDigito(baseCPF)
    const segundoDigito = calcularDigito(baseCPF + primeiroDigito)

    const cpfCalculado = baseCPF + primeiroDigito + segundoDigito

    return cpfCalculado === cpfNumerico
}



// BUSCAR CEP NA API DO VIACEP


function recuperarCEP(input) {
    const cep = input.value.replace(/\D/g, '')
    const url = `https://viacep.com.br/ws/${cep}/json/`

    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if (!input.validity.patternMismatch && !input.validity.valueMissing) {
        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                // A API do ViaCEP retorna { erro: true } quando o CEP não existe
                if (data.erro) {
                    input.setCustomValidity('Não foi possível buscar o CEP')
                    return
                }

                input.setCustomValidity('')
                preencheCamposComCEP(data)
            })
    }
}



// PREENCHER OS CAMPOS COM OS DADOS DO CEP


function preencheCamposComCEP(data) {
    const logradouro = document.querySelector('[data-tipo="logradouro"]')
    const cidade = document.querySelector('[data-tipo="cidade"]')
    const estado = document.querySelector('[data-tipo="estado"]')

    logradouro.value = data.logradouro
    cidade.value = data.localidade
    estado.value = data.uf
}
