//ARQUIVO PRINCIPAL

//1. importar o express
import express from "express";
//2. importar dot env
import * as dotenv from "dotenv"; //pq a documentação manda importar dessa maneira se usar modules do ES6

//3. habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//4. instanciar (invocar, fazer com que a função rode ao menos uma vez) a variável que vai ficar renponsável pelo nosso servidor - por padrão é app
const app = express();

//5. configurar o servidor para aceitar enviar e receber arquivos em JSON (se não fizer essa configuração, o servidor não vai entender JSON!!)
//.use() é um middleware
app.use(express.json());

//console.log("ESTOU DENTRO DO SERVIDOR");
//console.log(process.env.PORT);

//SIMULANDO UM BANCO DE DADOS:
const bancoDados = [
  {
    name: "Danielle Nascimento",
    age: 33,
    role: "TA",
    active: true,
    tasks: "fazer chamada, liberar calendly",
  },
];

//ROTAS:

//GET ALL
//dois parâmetros: 1) caminho, rota; 2) callback - recebe dois argumentos: req (request => requisições do cliente) e res (response => a resposta para o cliente)
app.get("/enap", (req, res) => {
  const bemVindo = "Bem vindo ao servidor da Enap turma 92 - IRONHACK";
  //retorna uma resposra com status de 200 e um JSON
  return res.status(200).json(bemVindo);
});

//CRIAR UMA ROTA QUE RETORNA BANCO DE DADOS
app.get("/all-users", (req, res) => {
  return res.status(200).json(bancoDados);
});

//NO FINAL DO ARQUIVO
//6. Servirdor subindo para o ar: .listen recebe dois parâmetros: 1. porta (que está definida no .env: process.env entra no arquivo .env, e PORT é a key do arquivo), 2. callback
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
