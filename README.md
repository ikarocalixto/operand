# Projeto de Gerenciamento de Clientes com React

Este projeto é uma aplicação web desenvolvida com React que permite aos usuários adicionar, visualizar, editar e deletar informações de clientes. A aplicação integra-se com uma API de backend para realizar operações CRUD (Create, Read, Update, Delete) sobre os dados dos clientes. Além disso, a aplicação tem capacidade de obter coordenadas geográficas através de endereços via a API do Google Maps.


## Funcionalidades

- **Listar clientes**: Exibe todos os clientes cadastrados.
- **Adicionar cliente**: Permite o cadastro de novos clientes, incluindo nome, email, telefone, e endereço.
- **Editar cliente**: Permite editar as informações de um cliente existente.
- **Deletar cliente**: Remove um cliente cadastrado.
- **Buscar por nome**: Filtra os clientes exibidos com base em um termo de pesquisa.
- **Calcular rota**: Ordena os clientes com base na proximidade a um ponto de referência definido (0,0).
- **Obter coordenadas**: Converte endereços em coordenadas geográficas usando a API do Google Maps.
- **Buscar endereço por coordenadas**: Retorna o endereço completo baseado em coordenadas geográficas.

# Banco de Dados

 - Para Utilizar o banco de dados copie e cole o sql o db está registrado no postgresql 
  - O banco de dados está registrado no postgresql
 
  ``` SQL
  CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    rua VARCHAR(255),
    cidade VARCHAR(255),
    estado VARCHAR(100)
);
```

## Tecnologias Utilizadas

- **React.js**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Axios**: Cliente HTTP baseado em promessas para o navegador e node.js, utilizado para fazer requisições à API.
- **CSS**: Para estilização dos componentes.

## Pré-requisitos

Antes de iniciar, você precisará ter instalado em sua máquina as seguintes ferramentas:

- [Node.js](https://nodejs.org/en/): Runtime de JavaScript que permite executar códigos JavaScript no backend.
- NPM (vem instalado com o Node.js): Gerenciador de pacotes para JavaScript.

## Instalação

Para instalar e executar o projeto localmente, siga estes passos:

1. Clone o repositório:
```bash
git clone https://seu-repositorio-aqui.com/projeto.git


Navegue até o diretório do projeto:
bash
Copy code
cd projeto
Instale as dependências:
bash
Copy code
npm install
Inicie a aplicação:
bash
Copy code
npm start
A aplicação estará disponível em http://localhost:3000.