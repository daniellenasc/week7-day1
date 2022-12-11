//função que gera o token

import jwt from "jsonwebtoken";

function generateToken(user) {
  //user -> é o usuário para quem vou criar esse token
  //user -> é o que vem do banco de dados

  const { _id, email, role } = user; //---> PAYLOAD!!!!! (informações guardadas no token)

  //signature -> a assinatura que prova que foi essa aplicação que criou o token
  const signature = process.env.TOKEN_SIGN_SECRET;

  //expiration define por quanto tempo o TOKEN será válido
  // "10" = 10 milissegundos
  // "10h" = 10 horas
  // "10d" = 10 dias
  const expiration = "12h";

  //essa função vai retornar o token assinado
  // jwt.sign() recebe 3 argumentos
  // 1) payload: quais as informações que vamos guardar dentro do token
  // 2) assinatura (a signature)
  // 3) objeto de configuração: onde se determina a expiração do token
  return jwt.sign({ _id, email, role }, signature, { expiresIn: expiration });
}

export default generateToken;
