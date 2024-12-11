# Projeto de Conexão com Keycloak
## _Augusto de Souza Corrêa - ADS 2024_

Este projeto é uma aplicação Express.js integrada ao Keycloak para autenticação via OpenID Connect. Ele permite o login de usuários, exibição de informações como nome e e-mail, e logout com redirecionamento para o Keycloak. A aplicação está sendo executada com Docker para facilitar o ambiente de desenvolvimento.

## Funcionalidades

- Autenticação de Usuários via OpenID Connect: Utiliza o Keycloak para autenticar usuários e fornecer um token de acesso.
- Exibição de Dados do Usuário: Após a autenticação, exibe o nome, sobrenome e e-mail do usuário.
- Logout: Permite que o usuário se deslogue da aplicação e do Keycloak, redirecionando-o após o logout.

## Pré-requisitos
Antes de rodar o projeto, certifique-se de ter as seguintes ferramentas instaladas:

- [Docker](https://www.docker.com/get-started/) e [Docker Compose](https://docs.docker.com/compose/) para orquestrar os contêineres.
- [Node.js](https://nodejs.org) e [npm](https://www.npmjs.com/) para rodar o código da aplicação localmente.

## Estrutura do Projeto

```
.
├── app.js               # Código da aplicação Express.js
├── client_secrets.json  # Configurações do cliente do Keycloak
├── docker-compose.yml   # Arquivo para orquestrar Keycloak e PostgreSQL
├── keycloak-config      
│   └── keycloak-realm-config.json  # Configuração do Realm no Keycloak
└── README.md            
```

## Passos para Rodar o Projeto
#### 1. Configuração do Keycloak (via Docker)
Primeiro, vamos rodar o Keycloak e o banco de dados PostgreSQL. Para isso, usaremos o Docker Compose para subir os serviços.

##### Passo 1:1 - Rodar o Docker Compose
Dentro da raíz do projeto, execute o seguinte comando para iniciar o Keycloak e o banco de dados PostgreSQL:
```
cd keycloak-provedor-servicos
docker-compose up --build
```
Isso irá:

- Subir o Keycloak na URL http://localhost:8080.
- Subir o banco de dados PostgreSQL para persistência dos dados do Keycloak.

##### Passo 1:2 - Verificar a Configuração do Keycloak
- Acesse o Keycloak no navegador: http://localhost:8080.
- Faça login com as credenciais administrativas:
  - Usuário: admin
  - Senha: admin
- Verifique se o existe um realm chamado IDP contento um client chamado SP.

#### 2. Configuração da Aplicação Express.js

Com o Docker Compose subindo o Keycloak, abra outra instância do terminal, entre na pasta keycloak_node_app e instale as dependências da aplicação Express.js:
```
cd keycloak_node_app
npm install
```

### 3. Rodar a Aplicação Express.js
Agora, você pode rodar a aplicação localmente. Execute o seguinte comando:

```
node app.js
```
A aplicação estará disponível em http://localhost:3000.

# Funcionalidades
### Login:

- Acesse http://localhost:3000/
- A aplicação vai identificar que você não está logado, mostrando um link para a página de login.
- Você será redirecionado para o Keycloak para autenticação.
- Após o login, você será redirecionado de volta para a aplicação.

### Exibição de Dados do Usuário:

- Após o login, na página inicial, serão exibidos o nome, sobrenome e e-mail do usuário logado.
- Caso o usuário não esteja logado, ele verá um link para a página de login.

### Logout:

- Ao clicar no link "Sair", o usuário será deslogado da aplicação e redirecionado para o Keycloak para 
- Após confirmar o logout no Keycloak, o usuário será redirecionado de volta para a página inicial da aplicação.


# Conclusão

Este projeto integra uma aplicação Express.js com o Keycloak usando OpenID Connect para autenticação de usuários. A aplicação suporta login, exibição de informações do usuário e logout, com a autenticação sendo gerenciada pelo Keycloak. O uso do Docker facilita a configuração e o gerenciamento dos serviços necessários, como o Keycloak e o banco de dados PostgreSQL.