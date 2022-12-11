// middleware que:
// 1. valida se o token que o usuário está enviando foi criado pela nossa aplicação (tem a mesma assinatura)
// 2. extrai o payload (data) que foi definido no jwt.config.js, criando a chave "req.auth"
// req.auth = {_id: "156161", email: "dani@email.com", role: "USER"}
// 3. cria a chave chamada: req.currentUser
// 4. next()

import { expressjwt } from "express-jwt";
import * as dotenv from "dotenv";

dotenv.config();

export default expressjwt({
  secret: process.env.TOKEN_SIGN_SECRET,
  algorithms: ["HS256"],
});

//quando a requisição passar por esse middleware, será criada uma chave chamada "AUTH", ou seja, será criada uma chave chamada req.auth, que vai ter dentro o payload (email, _id, role)
// req.auth -> payload -> email, _id, role
