//ARQUIVO PRINCIPAL

//1. importar o express
import express from "express";
//2. importar dot env
import * as dotenv from "dotenv"; //pq a documentação manda importar dessa maneira se usar modules do ES6

//importando o connect
import connect from "./config/db.config.js";

//importar as rotas:
import userRoute from "./routes/user.routes.js";
import taskRoute from "./routes/task.routes.js";
import uploadRoute from "./routes/uploadImage.routes.js";

//importar o cors -> determina de quem seu servidor vai receber as requisições, caso contrário ficará aberto e serem feitas muitas requisições
import cors from "cors";

//3. habilitar o servidor a ter variáveis de ambiente
dotenv.config();

//4. instanciar (invocar, fazer com que a função rode ao menos uma vez) a variável que vai ficar renponsável pelo nosso servidor - por padrão é app
const app = express();

//cors
app.use(cors());

//5. configurar o servidor para aceitar enviar e receber arquivos em JSON (se não fizer essa configuração, o servidor não vai entender JSON!!)
//.use() é um middleware
app.use(express.json());

//console.log("ESTOU DENTRO DO SERVIDOR");
//console.log(process.env.PORT);

//conectando com o banco de dados:
connect();

//7. CRIAR AS ROTAS NA PASTA ROUTE E IMPORTAR:
app.use("/user", userRoute);
app.use("/task", taskRoute);
app.use("/uploadImage", uploadRoute);

//NO FINAL DO ARQUIVO
//6. Servirdor subindo para o ar: .listen recebe dois parâmetros: 1. porta (que está definida no .env: process.env entra no arquivo .env, e PORT é a key do arquivo), 2. callback
app.listen(process.env.PORT, () => {
  console.log(
    `App up and running on port http://localhost:${process.env.PORT}`
  );
});
