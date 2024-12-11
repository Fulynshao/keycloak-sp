const express = require('express');
const session = require('express-session');
const axios = require('axios');

const app = express();

// Configuração da sessão
app.use(session({
  secret: 'your_secret_key', // Altere para algo seguro em produção
  resave: false,
  saveUninitialized: true,
}));

// Configurações do Keycloak
const keycloakConfig = {
  client_id: 'SP',
  client_secret: '6wCAHvoyvFEuxDBR7Auw4afQ4H1hp6vx',
  token_url: 'http://localhost:8080/realms/IDP/protocol/openid-connect/token',
  redirect_uri: 'http://localhost:3000/callback',
};

// Página inicial
app.get('/', (req, res) => {
  if (req.session.user) {
    res.send(`
      <h1>Bem-vindo, ${req.session.user.name} ${req.session.user.surname}!</h1>
      <p>Seu e-mail é: ${req.session.user.email}</p>
      <a href="/logout">Sair</a>
    `);
  } else {
    res.send('<a href="/login">Logar</a>');
  }
});

// Rota para iniciar o login
app.get('/login', (req, res) => {
  const authorizationUrl = `http://localhost:8080/realms/IDP/protocol/openid-connect/auth?` +
    `client_id=${keycloakConfig.client_id}&response_type=code&scope=openid` +
    `&redirect_uri=${encodeURIComponent(keycloakConfig.redirect_uri)}`;
  res.redirect(authorizationUrl);
});

// Rota de callback
app.get('/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send('Código de autorização não fornecido');
  }

  try {
    // Troca do código de autorização por um token de acesso
    const response = await axios.post(keycloakConfig.token_url, new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: keycloakConfig.redirect_uri,
      client_id: keycloakConfig.client_id,
      client_secret: keycloakConfig.client_secret,
    }).toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { access_token, id_token } = response.data;

    // Decodifica o token para extrair as informações do usuário
    const userInfo = JSON.parse(Buffer.from(access_token.split('.')[1], 'base64').toString());

    // Salva os dados na sessão
    req.session.user = {
      name: userInfo.given_name,
      surname: userInfo.family_name,
      email: userInfo.email,
    };
    

    res.redirect('/');
  } catch (err) {
    console.error('Erro ao obter token de acesso:', err.response?.data || err.message);
    res.status(500).send('Erro durante o login');
  }
});

// Rota de logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect(`http://localhost:8080/realms/IDP/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent('http://localhost:3000')}`);
  });
});

// Inicia o servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
