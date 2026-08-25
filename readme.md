# PetShop - Sistema de Cadastro

Projeto desenvolvido como prática durante as aulas do curso de Programador de Sistemas e Web, aplicando conceitos de formulários, validação avançada e integração com API externa.

## Tecnologias utilizadas

* HTML5
* CSS3 (organizado em componentes reutilizáveis)
* JavaScript (ES Modules)
* API ViaCEP

## Funcionalidades

* Cadastro de cliente com validação completa: nome, email, senha (com regras de segurança), data de nascimento (maior de 18 anos) e CPF (validação real do dígito verificador).
* Preenchimento automático de endereço a partir do CEP, usando a API ViaCEP.
* Cadastro de produtos, com máscara de valor monetário.
* Listagem de clientes cadastrados em formato de tabela.
* Feedback visual de erro em tempo real nos campos do formulário.

## Estrutura do projeto

* `index.html` — painel inicial, com acesso às demais telas.
* `cadastro.html` — formulário de cadastro de cliente.
* `cadastro_produto.html` — formulário de cadastro de produto.
* `lista_cliente.html` — listagem de clientes cadastrados.
* `css/` — estilos organizados em `base/` (reset, variáveis) e `componentes/` (botão, cabeçalho, cartão, input, modal, tabela).
* `js/` — lógica de validação dos formulários (`validacao.js`) e inicialização (`app.js`).

## Como executar

Não é necessário nenhum servidor ou instalação. Basta abrir o arquivo `index.html` diretamente no navegador.

## Observações

Este é um projeto apenas de front-end, sem back-end ou banco de dados: os dados exibidos na listagem de clientes são fictícios, usados apenas para demonstrar a interface.